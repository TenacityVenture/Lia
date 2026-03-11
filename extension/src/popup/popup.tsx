// @ts-nocheck

import React, { useEffect, useState } from "react";

// refreshToken function
const refreshToken = async () => {
  try {
    const response = await fetch(
      "https://api.getlia.live/api/auth/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // include credentials to allow cookies to be sent
        credentials: "include",
      },
    );

    const data = await response.json();
    await chrome.storage.local.set({ access_token: data.access_token });
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

const Popup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);

  // Settings state
  const [settings, setSettings] = useState({
    tone: "professional",
    industry: "tech",
    rewrite_enabled: true,
    reply_enabled: true,
    chatbot_enabled: true,
  });

  const [saveStatus, setSaveStatus] = useState<string>("Save Settings");

  useEffect(() => {
    const checkAuth = async () => {
      const { access_token } = await chrome.storage.local.get(["access_token"]);

      if (!access_token) {
        setIsAuthenticated(false);
        return;
      }

      const getMe = async (token: string) => {
        return await fetch("https://api.getlia.live/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
      };

      let meRes = await getMe(access_token);

      if (!meRes.ok) {
        // try refreshing the token
        const newToken = await refreshToken();
        if (!newToken) {
          setIsAuthenticated(false);
          return;
        }
        meRes = await getMe(newToken);
      }

      const user = await meRes.json();
      setUserData(user);
      setIsAuthenticated(true);

      // Fetch usage stats
      const tokenToUse = (await chrome.storage.local.get(["access_token"]))
        .access_token;
      try {
        const usageRes = await fetch(
          "https://api.getlia.live/api/usage/stats",
          {
            headers: { Authorization: `Bearer ${tokenToUse}` },
          },
        );
        const usage = await usageRes.json();
        setUsageData(usage);
      } catch (err) {
        console.error("Error fetching usage stats", err);
      }
    };

    checkAuth();

    // Load saved settings
    chrome.storage.sync.get(
      [
        "tone",
        "industry",
        "rewrite_enabled",
        "reply_enabled",
        "chatbot_enabled",
      ],
      (data) => {
        setSettings((prev) => ({
          ...prev,
          tone: data.tone || prev.tone,
          industry: data.industry || prev.industry,
          rewrite_enabled:
            data.rewrite_enabled !== undefined
              ? data.rewrite_enabled
              : prev.rewrite_enabled,
          reply_enabled:
            data.reply_enabled !== undefined
              ? data.reply_enabled
              : prev.reply_enabled,
          chatbot_enabled:
            data.chatbot_enabled !== undefined
              ? data.chatbot_enabled
              : prev.chatbot_enabled,
        }));
      },
    );
  }, []);

  const handleSignIn = () => {
    chrome.tabs.create({ url: "https://www.getlia.live/login?src=extension" });
  };

  const handleSaveSettings = () => {
    chrome.storage.sync.set(settings, () => {
      // Show success message
      setSaveStatus("✅ Settings saved!");

      setTimeout(() => {
        setSaveStatus("Save Settings");
      }, 1500);

      // Notify content script that settings have changed
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "settingsUpdated" });
        }
      });
    });
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="container"
        id="unauthenticated"
        style={{ display: "flex" }}
      >
        <h1>Welcome to LIA ✨</h1>
        <p>Your intelligent LinkedIn assistant</p>
        <button
          id="signin-btn"
          className="primary-button"
          onClick={handleSignIn}
        >
          Sign in with LinkedIn
        </button>
        <span style={{ textAlign: "center" }}>
          or{" "}
          <a href="https://getlia.live/signup" target="_blank" rel="noreferrer">
            Create Account
          </a>
        </span>
      </div>
    );
  }

  // Calculate generic plan and name
  const isPlanExpired =
    userData?.plan_expires_at &&
    new Date(userData.plan_expires_at) < new Date();
  const planName = isPlanExpired
    ? "Plan Expired"
    : userData?.plan
      ? `${userData.plan}`.toUpperCase()
      : "Free";
  const planStyle = isPlanExpired ? { color: "red" } : {};

  const userName = userData?.name
    ? userData.name.split(" ")[0]
    : userData?.email
      ? userData.email.split("@")[0]
      : "...";

  return (
    <div className="container" id="authenticated" style={{ display: "flex" }}>
      <header>
        <h2 style={{ position: "relative" }}>
          Hello 👋 <span id="username">{userName}</span>
          <span id="plan" style={planStyle}>
            {planName}
          </span>
        </h2>
        <p className="highlight">
          You've enhanced{" "}
          <strong id="rewrite-count">{usageData?.post_rewrites || 0}</strong>{" "}
          posts with LIA
        </p>
      </header>

      <div className="settings container">
        <label>Writing Tone:</label>
        <select
          id="tone"
          value={settings.tone}
          onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="enthusiastic">Enthusiastic</option>
          <option value="informative">Informative</option>
        </select>

        <label>Industry:</label>
        <select
          id="industry"
          value={settings.industry}
          onChange={(e) =>
            setSettings({ ...settings, industry: e.target.value })
          }
        >
          <option value="tech">Tech</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      <div className="features container">
        <label>
          <input
            type="checkbox"
            id="rewrite-enabled"
            checked={settings.rewrite_enabled}
            onChange={(e) =>
              setSettings({ ...settings, rewrite_enabled: e.target.checked })
            }
          />{" "}
          Enable Post Rewrite
        </label>
        <label>
          <input
            type="checkbox"
            id="reply-enabled"
            checked={settings.reply_enabled}
            onChange={(e) =>
              setSettings({ ...settings, reply_enabled: e.target.checked })
            }
          />{" "}
          Enable Comment Replies
        </label>
        <label>
          <input
            type="checkbox"
            id="chatbot-enabled"
            checked={settings.chatbot_enabled}
            onChange={(e) =>
              setSettings({ ...settings, chatbot_enabled: e.target.checked })
            }
          />{" "}
          Enable Chatbot Mode
        </label>
      </div>

      <button
        id="save-btn"
        className="primary-button"
        style={{ marginTop: "5px" }}
        onClick={handleSaveSettings}
      >
        {saveStatus}
      </button>

      <footer>
        <p>LIA v0.1 by Tenacity</p>
      </footer>
    </div>
  );
};

export default Popup;
