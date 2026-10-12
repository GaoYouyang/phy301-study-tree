"use client";

import { modules } from "./course-data";
import {
  CourseHubClient,
  CourseHubError,
  isSignedOut,
  masteryToCloud,
  mergeCloudSnapshot,
  type CourseSnapshot,
} from "./course-hub-client";
import type { StoredState } from "./mastery-state";
import { useEffect, useMemo, useState } from "react";

const LOCAL_QUESTION_KEY = "phy301-local-questions-v1";
const MODULE_IDS = new Set(modules.map((item) => item.id));

type LocalQuestion = {
  id: string;
  nodeId: string;
  question: string;
  status: "open";
  createdAt: string;
};

type Props = {
  localState: StoredState;
  selectedModuleId: string;
  onApplyCloud: (state: StoredState) => void;
  onSelectModule: (moduleId: string) => void;
};

type ConnectionState = "checking" | "signed-out" | "connected" | "offline";

function parseLocalQuestions(raw: string | null): LocalQuestion[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is LocalQuestion =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as LocalQuestion).id === "string" &&
        typeof (item as LocalQuestion).nodeId === "string" &&
        MODULE_IDS.has((item as LocalQuestion).nodeId) &&
        typeof (item as LocalQuestion).question === "string" &&
        typeof (item as LocalQuestion).createdAt === "string" &&
        !Number.isNaN(Date.parse((item as LocalQuestion).createdAt)),
    );
  } catch {
    return [];
  }
}

function moduleTitle(moduleId: string | null) {
  return modules.find((item) => item.id === moduleId)?.title ?? moduleId ?? "课程总问题";
}

export default function CloudSyncPanel({
  localState,
  selectedModuleId,
  onApplyCloud,
  onSelectModule,
}: Props) {
  const [client] = useState(() => new CourseHubClient());

  const [connection, setConnection] = useState<ConnectionState>("checking");
  const [snapshot, setSnapshot] = useState<CourseSnapshot | null>(null);
  const [token, setToken] = useState("");
  const [questionDraft, setQuestionDraft] = useState("");
  const [localQuestions, setLocalQuestions] = useState<LocalQuestion[]>([]);
  const [message, setMessage] = useState("正在检查同源云端会话……");
  const [busy, setBusy] = useState(false);
  const [secureLoginAllowed, setSecureLoginAllowed] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const frame = window.requestAnimationFrame(() => {
      setSecureLoginAllowed(
        window.location.protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1",
      );
      setLocalQuestions(parseLocalQuestions(window.localStorage.getItem(LOCAL_QUESTION_KEY)));
    });

    let cancelled = false;
    void (async () => {
      try {
        await client.resumeSession();
        const cloud = await client.snapshot();
        if (cancelled) return;
        setSnapshot(cloud);
        setConnection("connected");
        setMessage("云端已连接。选择同步方向前，本机记录不会被覆盖或上传。");
      } catch (error) {
        if (cancelled) return;
        if (isSignedOut(error)) {
          setConnection("signed-out");
          setMessage("同步服务在线，但当前浏览器尚未登录。课程和本机记录仍可正常使用。");
        } else {
          setConnection("offline");
          setMessage("暂时无法连接云端；问题会先保存在本机，学习记录不受影响。");
        }
      }
    })();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [client]);

  const visibleQuestions = useMemo(() => {
    const cloud = (snapshot?.questions ?? [])
      .filter((item) => item.status !== "archived")
      .map((item) => ({ ...item, source: "cloud" as const }));
    const local = localQuestions.map((item) => ({
      ...item,
      answer: null,
      updatedAt: item.createdAt,
      source: "local" as const,
    }));
    return [...cloud, ...local]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
      .slice(0, 8);
  }, [localQuestions, snapshot]);

  function persistLocalQuestions(next: LocalQuestion[]) {
    setLocalQuestions(next);
    window.localStorage.setItem(LOCAL_QUESTION_KEY, JSON.stringify(next));
  }

  async function refreshSnapshot() {
    const cloud = await client.snapshot();
    setSnapshot(cloud);
    setConnection("connected");
    return cloud;
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!secureLoginAllowed || !token) return;
    const enteredToken = token;
    setToken("");
    setBusy(true);
    try {
      await client.login(enteredToken);
      await refreshSnapshot();
      setMessage("登录成功。现在请选择“本机 → 云端”或“云端 → 本机”。");
    } catch (error) {
      setConnection(error instanceof CourseHubError && error.status === 401 ? "signed-out" : "offline");
      setMessage(
        error instanceof CourseHubError && error.status === 401
          ? "访问令牌不正确；输入框已清空，请重新输入。"
          : "暂时无法登录；课程和本机记录仍可正常使用。",
      );
    } finally {
      setToken("");
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await client.logout();
      setSnapshot(null);
      setConnection("signed-out");
      setMessage("已退出云端会话；本机记录和本机问题没有删除。");
    } catch {
      setConnection("offline");
      setMessage("暂时无法完成退出请求，请恢复连接后重试。");
    } finally {
      setBusy(false);
    }
  }

  async function retryConnection() {
    setBusy(true);
    setConnection("checking");
    try {
      await client.resumeSession();
      await refreshSnapshot();
      setMessage("云端会话已恢复。请选择需要的同步方向。");
    } catch (error) {
      setConnection(isSignedOut(error) ? "signed-out" : "offline");
      setMessage(isSignedOut(error) ? "同步服务在线，请先登录。" : "云端仍不可用；已继续使用本机记录。");
    } finally {
      setBusy(false);
    }
  }

  async function uploadLocalState() {
    if (connection !== "connected") return;
    setBusy(true);
    setMessage("正在把本机节点进度与笔记补充到云端……");
    const writes: Promise<unknown>[] = modules.map((item) =>
      client.putProgress(item.id, masteryToCloud(localState.statuses[item.id])),
    );
    for (const [moduleId, note] of Object.entries(localState.notes)) {
      if (MODULE_IDS.has(moduleId) && note.trim()) writes.push(client.putNote(moduleId, note));
    }
    writes.push(client.putRecent(localState.lastModule));

    const results = await Promise.allSettled(writes);
    const failed = results.filter((result) => result.status === "rejected").length;
    try {
      await refreshSnapshot();
      setMessage(
        failed === 0
          ? "本机进度、非空笔记与续学位置已写入云端；云端原有但本机为空的笔记没有被删除。"
          : `已完成部分同步；${failed} 条写入失败，保留本机记录后可重试。`,
      );
    } catch {
      setConnection("offline");
      setMessage("写入后暂时无法重新读取云端；本机记录仍完整保留。请稍后刷新核对。");
    } finally {
      setBusy(false);
    }
  }

  function downloadCloudState() {
    if (!snapshot) return;
    const confirmed = window.confirm(
      "这会用云端的节点状态、同名笔记和续学位置更新本机；本机复习队列、错因本与诊断答案会保留。继续吗？",
    );
    if (!confirmed) return;
    const merged = mergeCloudSnapshot(localState, snapshot, MODULE_IDS);
    onApplyCloud(merged);
    if (snapshot.recent && MODULE_IDS.has(snapshot.recent.nodeId)) onSelectModule(snapshot.recent.nodeId);
    setMessage("云端节点状态、笔记与续学位置已合并到本机；专项复习记录保持不变。");
  }

  function saveQuestionLocally(question: string) {
    const entry: LocalQuestion = {
      id: globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}`,
      nodeId: selectedModuleId,
      question,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    persistLocalQuestions([entry, ...localQuestions]);
  }

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = questionDraft.trim();
    if (!question) return;
    setQuestionDraft("");
    setBusy(true);

    if (connection === "connected") {
      try {
        await client.createQuestion(selectedModuleId, question);
        await refreshSnapshot();
        setMessage("问题已保存到云端，并绑定当前知识节点。");
      } catch {
        saveQuestionLocally(question);
        setConnection("offline");
        setMessage("云端写入失败，问题已安全保存在本机；恢复连接后可手动上传。");
      } finally {
        setBusy(false);
      }
      return;
    }

    saveQuestionLocally(question);
    setMessage("问题已保存在本机；登录后可明确选择上传，不会自动外发。");
    setBusy(false);
  }

  async function uploadLocalQuestions() {
    if (connection !== "connected" || localQuestions.length === 0) return;
    setBusy(true);
    const results = await Promise.allSettled(
      localQuestions.map((question) => client.createQuestion(question.nodeId, question.question)),
    );
    const remaining = localQuestions.filter((_, index) => results[index].status === "rejected");
    persistLocalQuestions(remaining);
    try {
      await refreshSnapshot();
    } catch {
      setConnection("offline");
    }
    setMessage(
      remaining.length === 0
        ? "本机问题已全部上传云端，并从本机待同步队列移除。"
        : `${localQuestions.length - remaining.length} 条已上传，${remaining.length} 条仍安全保留在本机。`,
    );
    setBusy(false);
  }

  const statusLabel = {
    checking: "正在检查",
    "signed-out": "云端未登录",
    connected: "云端已连接",
    offline: "本机模式",
  }[connection];

  return (
    <section className="cloud-sync-panel" aria-labelledby="cloud-sync-title" aria-busy={busy}>
      <div className="cloud-sync-heading">
        <div>
          <span>CLOUD SYNC · OPTIONAL</span>
          <h2 id="cloud-sync-title">云同步与问题箱</h2>
          <p>默认仍保存在本机；登录后也必须由你明确选择同步方向。</p>
        </div>
        <strong className={`cloud-status status-${connection}`}>
          <i aria-hidden="true" /> {statusLabel}
        </strong>
      </div>

      <p className="cloud-message" role="status" aria-live="polite">{message}</p>

      {connection !== "connected" ? (
        <div className="cloud-login-layout">
          <form onSubmit={login} className="cloud-login-form">
            <label htmlFor="course-hub-token">访问令牌</label>
            <input
              id="course-hub-token"
              type="password"
              autoComplete="current-password"
              value={token}
              disabled={!secureLoginAllowed || busy}
              onChange={(event) => setToken(event.target.value)}
            />
            <button type="submit" disabled={!secureLoginAllowed || !token || busy}>
              登录云同步
            </button>
          </form>
          <div className="cloud-login-note">
            <p>令牌只用于这一次登录请求，发送后立即清空，不会写入 localStorage 或网页源码。</p>
            {!secureLoginAllowed && (
              <p className="cloud-warning">当前不是 HTTPS/本机安全环境。请等域名 HTTPS 启用，或通过本机 SSH 隧道后再登录。</p>
            )}
            <button type="button" className="cloud-text-button" disabled={busy} onClick={() => void retryConnection()}>
              重新检查连接
            </button>
          </div>
        </div>
      ) : (
        <div className="cloud-direction-grid">
          <article>
            <span>LOCAL → CLOUD</span>
            <h3>把本机记录补充到云端</h3>
            <p>上传 19 个节点状态、非空笔记和当前续学位置；不会因本机空白而删除云端笔记。</p>
            <button type="button" disabled={busy} onClick={() => void uploadLocalState()}>
              本机 → 云端
            </button>
          </article>
          <article>
            <span>CLOUD → LOCAL</span>
            <h3>用云端记录更新本机</h3>
            <p>
              云端现有 {snapshot?.progress.length ?? 0} 条进度、{snapshot?.notes.length ?? 0} 条笔记；本机复习队列、错因与诊断保留。
            </p>
            <button type="button" disabled={busy || !snapshot} onClick={downloadCloudState}>
              云端 → 本机
            </button>
          </article>
          <button type="button" className="cloud-text-button cloud-logout" disabled={busy} onClick={() => void logout()}>
            退出云端会话
          </button>
        </div>
      )}

      <div className="question-box">
        <div className="question-compose">
          <div>
            <span>ASK AT THE CURRENT NODE</span>
            <h3>我卡在：{moduleTitle(selectedModuleId)}</h3>
            <p className="question-order-note">
              提问只会新增一条绑定当前节点的记录，不会改变学习进度、跳过 gate 或打乱后续顺序。
            </p>
          </div>
          <form onSubmit={submitQuestion}>
            <label htmlFor="course-question" className="sr-only">记录当前节点的问题</label>
            <textarea
              id="course-question"
              value={questionDraft}
              maxLength={5_000}
              onChange={(event) => setQuestionDraft(event.target.value)}
              placeholder="只写一个具体问题，例如：为什么正则系综固定 N，却允许能量涨落？"
            />
            <button type="submit" disabled={busy || !questionDraft.trim()}>
              {connection === "connected" ? "保存到云端" : "先保存到本机"}
            </button>
          </form>
          {connection === "connected" && localQuestions.length > 0 && (
            <button type="button" className="upload-local-questions" disabled={busy} onClick={() => void uploadLocalQuestions()}>
              上传 {localQuestions.length} 条本机待同步问题
            </button>
          )}
        </div>

        <div className="question-list" aria-label="最近问题">
          {visibleQuestions.length === 0 ? (
            <p className="cloud-empty">还没有问题。卡住时就在这里写一句，之后不会打乱学习顺序。</p>
          ) : (
            visibleQuestions.map((question) => (
              <article key={`${question.source}-${question.id}`}>
                <div>
                  <span>{question.source === "local" ? "本机待同步" : question.status === "answered" ? "已有回答" : "云端问题"}</span>
                  <time>{new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date(question.updatedAt))}</time>
                </div>
                <button type="button" onClick={() => onSelectModule(question.nodeId ?? selectedModuleId)}>
                  回到节点：{moduleTitle(question.nodeId)}
                </button>
                <p>{question.question}</p>
                {question.answer && <blockquote>{question.answer}</blockquote>}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
