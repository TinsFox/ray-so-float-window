import { getSelectedText, showToast, showHUD, getPreferenceValues, Toast } from "@raycast/api";
import { encodeURI } from "js-base64";
import { displayWindow } from "./create-float-window";
import { closeMainWindow } from "@raycast/api";

interface Preferences {
  theme: string;
  padding: number;
  darkMode: boolean;
  background: boolean;
}

export default async () => {
  const preferences: Preferences = getPreferenceValues();

  let selectedText;
  try {
    selectedText = await getSelectedText();
  } catch (e) {
    await showHUD(
      "❌ Screenshot generation failed. Please make sure you've selected the text you want to take a screenshot of.",
    );
    return;
  }

  const base64Text = encodeURI(selectedText);

  await showToast({
    style: Toast.Style.Animated,
    title: "Generating screenshot",
  });

  const url = `https://ray.so/#theme=${preferences.theme}&background=${preferences.background}&darkMode=${preferences.darkMode}&padding=${preferences.padding}&code=${base64Text}`;
  closeMainWindow();
  await displayWindow(url);
};
