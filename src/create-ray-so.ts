import { runAppleScript } from "@raycast/utils";
const script = (url: string) => `use framework "Foundation"
use framework "WebKit"
use scripting additions

set theWindow to missing value
set theWebView to missing value

my performSelectorOnMainThread:"showWindow" withObject:(missing value) waitUntilDone:true

on showWindow()
	global theWindow
	global theWebView
	set theContentRect to current application's NSMakeRect(0, 0, 900, 600)
	set theWindowStyle to (get current application's NSWindowStyleMaskTitled) + (get current application's NSWindowStyleMaskClosable) + (get current application's NSWindowStyleMaskMiniaturizable) + (get current application's NSWindowStyleMaskResizable)
	set theWindow to current application's NSWindow's alloc()'s initWithContentRect:theContentRect styleMask:theWindowStyle backing:(current application's NSBackingStoreBuffered) defer:false
	theWindow's setDelegate:me

	theWindow's setOpaque:false
	theWindow's setMovableByWindowBackground:true
	theWindow's setTitlebarAppearsTransparent:true

	set webViewFrame to current application's NSMakeRect(0, 0, 900, 600)
	set theWebView to current application's WKWebView's alloc()'s initWithFrame:webViewFrame

	set targetURL to current application's NSURL's URLWithString:"${url}"
	set urlRequest to current application's NSURLRequest's requestWithURL:targetURL
	theWebView's loadRequest:urlRequest

	theWindow's contentView()'s addSubview:theWebView

	theWindow's setLevel:(current application's NSFloatingWindowLevel)

	current application's NSApp's runModalForWindow:theWindow
end showWindow

on closeWindow:sender
	current application's NSApp's stopModal()
	theWindow's |close|()
end closeWindow:

on windowWillClose:theNotification
	current application's NSApp's stopModal()
end windowWillClose:

on windowDidBecomeKey:theNotification
	global theWindow
	theWindow's setLevel:(current application's NSFloatingWindowLevel)
end windowDidBecomeKey:

on windowDidResignKey:theNotification
	global theWindow
	theWindow's setLevel:(current application's NSFloatingWindowLevel)
end windowDidResignKey:

on windowDidResize:theNotification
	global theWindow
	global theWebView

	set contentFrame to theWindow's contentView()'s frame()
	theWebView's setFrame:contentFrame
end windowDidResize:`;

export const displayWindow = async (url: string) => {
  const timeout = 60000;

  return await runAppleScript(script(url), [], { timeout });
};
