import { closeMainWindow, Action, ActionPanel, Form, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { displayWindow } from "./create-float-window";

interface Preferences {
  theme: string;
  background: string;
  darkMode: boolean;
  padding: number;
}

const languages = [
  "auto",
  "apache",
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "diff",
  "go",
  "html",
  "java",
  "javascript",
  "json",
  "kotlin",
  "less",
  "lua",
  "markdown",
  "objectivec",
  "php",
  "python",
  "ruby",
  "rust",
  "scala",
  "scss",
  "sql",
  "swift",
  "typescript",
  "xml",
  "yaml",
];

const colors = ["candy", "breeze", "midnight", "sunset", "ocean", "raindrop"];

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { title: string; code: string; language: string; color: string }) {
    setIsLoading(true);
    try {
      const base64Text = Buffer.from(values.code).toString("base64");
      const url = `https://ray.so/#theme=${values.color}&language=${values.language}&background=${preferences.background}&darkMode=${preferences.darkMode}&padding=${preferences.padding}&code=${base64Text}`;
      await closeMainWindow();
      await displayWindow(url);
    } catch (error) {
      console.error("Error:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to process request",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Generate"
            onSubmit={handleSubmit}
            shortcut={{ modifiers: ["cmd"], key: "return" }}
          />
        </ActionPanel>
      }
      isLoading={isLoading}
    >
      <Form.TextField id="title" title="Title" placeholder="Enter snippet title" />
      <Form.TextArea id="code" title="Code" placeholder="Paste your code here" />
      <Form.Dropdown id="language" title="Language" defaultValue="auto">
        {languages.map((lang) => (
          <Form.Dropdown.Item key={lang} value={lang} title={lang} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown id="color" title="Color Theme" defaultValue="candy">
        {colors.map((color) => (
          <Form.Dropdown.Item key={color} value={color} title={color} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
