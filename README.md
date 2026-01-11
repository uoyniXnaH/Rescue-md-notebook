# Rescue Notepad
My simple markdown editor.

> [!NOTE]
> This app is still in alpha stage. Tested in Windows 11 only. Use it with caution, and data backup is recommended.

## Why this app
For several years I am using an open-source alternaive of Notion, it saves my data locally so I do not have any compliance concerns. However after a version up, my data backup could not be restored. I noticed that it was because the new version introduced some break changes and it is not compatible with backup from old version anymore. I rolled back to the old version, surprised to find that the backup could not be imported even in the old version. Maybe the data was corrupted, maybe I failed to backup it (there was no data backup by the app, I copied the user data manually), but the essential problem is that, why the app encrypts and compresses my local data?

Well, I think the reason is quite simple: the development team also provides a cloud service. Those compressed data could be uploaded to cloud seamlessly. Sure, for development team it is reasonable to compress user data, I understand. Nevertheless I felt fairly frustrated not being able to recover my data, even they are stored in my PC.

On the other hand, I started to consider developing my own markdown editor seriously. Neither Notion nor the open-source one meet my all demands, why not create my own one, for work, practice, and entertainment -- I win three times, and no one loses.

## Why Tauri
You may hear that Tauri has many bugs, and native webview seems not to be a good idea for desktop apps, me too. But I compared several frameworks and eventually chose Tauri.
- Electron: too heavy, I do not want to introduce a full Chromium just for my 20-MB app
- Flutter: no more front-end language. React is enough for me. I do not really like front-end development
- Wails: I am sorry but when I know this framework, the project has been started for several months. Maybe next time?
- Tauri: lightweight, simple, and I want to learn Rust. My app is also simple so I guess those bugs would not bother me too much

## Features
- Simple and lightweight
- Based on native file system. No encryption, no compression
- Flexible order and position from the file tree
- Markdown rendering

## Usage
> [!NOTE]
> The app creates file in the exe path, please install it at where you have full permissions

1. Run the app, set root path from the modal, or at the root menu
2. The app creates file tree from the root path
3. From the app you could create new file/folder (i.e. node), add notes to a node, change the order or position of a node
4. it is not recommended to change files in the root path manually, it may cause bugs in the app

## Contribute
Thank you for your interest in this app. As it is still in an early stage of development, I’m not accepting pull requests at the moment. I sincerely appreciate it if you could open an issue to report bugs or share suggestions :)