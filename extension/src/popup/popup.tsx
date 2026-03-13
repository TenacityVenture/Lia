// @ts-nocheck
import { useEffect, useState } from "react";

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

const Icons = {
  User: () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        fill="rgba(0,0,0,0.05)"
      />
      <circle cx="12" cy="7" r="4" fill="rgba(0,0,0,0.05)" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path
        d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
        fill="rgba(255,193,7,0.1)"
      />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  ),
  Settings: () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        fill="rgba(0,0,0,0.05)"
      />
      <circle cx="12" cy="12" r="3" fill="rgba(0,0,0,0.05)" />
    </svg>
  ),
  Zap: () => (
    <svg className="icon-svg" viewBox="0 0 24 24">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="rgba(255,193,7,0.15)" />
    </svg>
  ),
  Check: () => (
    <svg
      className="icon-svg"
      viewBox="0 0 24 24"
      style={{ width: 16, height: 16 }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  LinkedIn: () => (
    <svg className="icon-svg fill" viewBox="0 0 24 24">
      <path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"></path>
    </svg>
  ),
  Google: () => (
    <svg className="icon-svg fill" viewBox="0 0 24 24">
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path>
    </svg>
  ),
};

const SOCIAL_PROVIDERS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Icons.LinkedIn,
    url: "https://www.getlia.live/login?src=extension",
    className: "btn-linkedin",
  },
  {
    id: "google",
    name: "Google",
    icon: Icons.Google,
    url: "https://www.getlia.live/login?src=extension&provider=google",
    className: "btn-google",
  },
];

const FEATURES_CONFIG = [
  {
    id: "rewrite_enabled",
    label: "Post Rewrite",
    icon: Icons.Zap,
  },
  {
    id: "reply_enabled",
    label: "AI Comment Reply",
    icon: Icons.Zap,
  },
  {
    id: "chatbot_enabled",
    label: "Chatbot Assistant",
    icon: Icons.Zap,
  },
];

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
      try {
        const { access_token } = await chrome.storage.local.get([
          "access_token",
        ]);

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

          if (!meRes.ok) {
            setIsAuthenticated(false);
            return;
          }
        }

        const user = await meRes.json();
        setUserData(user);
        setIsAuthenticated(true);

        // Fetch usage stats
        const tokenToUse =
          (await chrome.storage.local.get(["access_token"])).access_token ||
          access_token;
        try {
          const usageRes = await fetch(
            "https://api.getlia.live/api/usage/stats",
            {
              headers: { Authorization: `Bearer ${tokenToUse}` },
            },
          );
          if (usageRes.ok) {
            const usage = await usageRes.json();
            setUsageData(usage);
          }
        } catch (err) {
          console.error("Error fetching usage stats", err);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
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
      setSaveStatus("Settings Saved");

      setTimeout(() => {
        setSaveStatus("Save Settings");
      }, 1500);

      // Notify content script that settings have changed
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id && tabs[0].url?.includes("linkedin.com")) {
          chrome.tabs
            .sendMessage(tabs[0].id, { action: "settingsUpdated" })
            .catch((err) => {
              // Ignore errors when receiving end doesn't exist (e.g. page not refreshed)
              console.debug("Could not notify content script:", err);
            });
        }
      });
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="lia-loading-container">
        <div className="lia-spinner" />
        <p style={{ margin: 0, fontStyle: "italic", opacity: 0.8 }}>
          Please wait.. loading preferences
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container" id="unauthenticated">
        <div className="glass-panel auth-header">
          <h1>LIA</h1>
          <p>Your LinkedIn Intelligent Assistant</p>
        </div>

        <div className="glass-panel">
          <p style={{ marginBottom: 20 }}>
            Enhance your LinkedIn presence with AI-driven engagement.
          </p>

          {SOCIAL_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              className={`btn-social ${provider.className}`}
              onClick={() => chrome.tabs.create({ url: provider.url })}
            >
              <provider.icon /> Continue with {provider.name}
            </button>
          ))}

          <div className="auth-divider">or</div>

          <div className="secondary-action">
            <a
              href="https://getlia.live/login"
              target="_blank"
              rel="noreferrer"
              className="link-styled"
              style={{ fontSize: "0.9rem", color: "#fff" }}
            >
              Sign in with Email
            </a>
          </div>

          <div
            className="secondary-action"
            style={{ marginTop: 24, fontSize: "0.8rem", opacity: 0.8 }}
          >
            Don't have an account?{" "}
            <a
              href="https://getlia.live/signup"
              target="_blank"
              rel="noreferrer"
              className="link-styled"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate generic plan and name
  const isPlanExpired =
    userData?.plan_expires_at &&
    new Date(userData.plan_expires_at) < new Date();

  const planName = isPlanExpired
    ? "Expired"
    : userData?.plan
      ? `${userData.plan}`
      : "Free";

  const userName = userData?.name
    ? userData.name.split(" ")[0]
    : userData?.email
      ? userData.email.split("@")[0]
      : "User";

  return (
    <div className="container" id="authenticated">
      <div className="glass-panel">
        <div className="header-row">
          <h2 title={userName}>Hi, {userName}</h2>
          <span className="plan-badge">{planName}</span>
        </div>
        <div className="stat-box">
          <div className="stat-icon">
            <Icons.Sparkles />
          </div>
          <div className="stat-text">
            <strong>{usageData?.post_rewrites || 0}</strong> Posts Enhanced
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <span className="section-label">Writing Persona</span>
        <div className="input-group">
          <select
            value={settings.tone}
            onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
          >
            <option value="professional">Professional Tone</option>
            <option value="casual">Casual Tone</option>
            <option value="enthusiastic">Enthusiastic Tone</option>
            <option value="informative">Informative Tone</option>
          </select>
        </div>

        <div className="input-group">
          <select
            value={settings.industry}
            onChange={(e) =>
              setSettings({ ...settings, industry: e.target.value })
            }
          >
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="glass-panel">
        <span className="section-label">Automation Features</span>

        {FEATURES_CONFIG.map((feature) => (
          <label key={feature.id} className="toggle-row">
            <div className="toggle-info">
              <feature.icon />
              <span className="toggle-label">{feature.label}</span>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={
                  settings[feature.id as keyof typeof settings] as boolean
                }
                onChange={() =>
                  setSettings({
                    ...settings,
                    [feature.id]:
                      !settings[feature.id as keyof typeof settings],
                  })
                }
              />
              <span className="slider"></span>
            </div>
          </label>
        ))}
      </div>

      <button
        className={`btn-primary ${saveStatus === "Settings Saved" ? "success" : ""}`}
        onClick={handleSaveSettings}
      >
        {saveStatus === "Settings Saved" ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Icons.Check /> {saveStatus}
          </span>
        ) : (
          saveStatus
        )}
      </button>

      <footer>LIA Engine v3.0 by Tenacity Ventures</footer>
    </div>
  );
};
export default Popup;
