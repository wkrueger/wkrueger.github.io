I reinstalled Windows from scratch on my machine and took notes on the required steps.

Context: I current work with web development - mostly node.js - and use the same machine for personal use (games).

## Before cleanup

- Move files to a separate partition or storage which won't be erased. Example:
	- My repositories (Documents) folder
	- Desktop folder
	- Steam library
		- Steam has a nice UI where you can set addicional Libraries and transfer games between them!
	- I didn't backup any Docker volumes, but that is possible to do;
	- Move Blizzard games folders (they are self contained)
	- And maybe something else I forgot to take note...
- If you only have one storage device, you can partition it by creating a Linux USB, then running GParted; Maybe Windows's Disk Manager suffices, but it has limitations.
- Another option is uploading to an online service like Amazon S3;
- Create USB media from the provided creation tool at Windows website;
- Boot from USB (depends on your computer);

## Windows Install

Boot the Windows USB.

I had issues, see appendix.

## After install

- First task: Install updates
	- Updates can take a while and are a requisite to running the debloater script;
	- After each restart, force checking again until no updates show up;
- Remove bloatware from start menu;
- Install the latest version of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2);
- Disable Windows Defender
	- Windows Defender eats a significant amount of CPU and I/O;
	- Currently to do this you need an external program - [Defender Control](https://www.sordum.org/9480/defender-control-v2-1/);
	- Before running Defender Control, you must disable " tamper protection" and add its folder to the exclusions list on Windows Security;
- Download your browser or just use Edge.
- Install Git
	- The Git install prompts dozens of questions. The following ones are important points which I recommend changing from the defaults:
		- Don't use MinTTY, use the default Windows terminals;
		- Commit as-is (don't convert CR/LF). Handle line endings on your editors;
		- Use external OpenSSH client (now Windows comes with one);
	- Additional setup
		- You can add the git `/bin` folder to PATH. With that, you can invoke Git Bash (the MINGW terminal) from any console with `sh`; You usually don't need Git Bash (and should avoid using it as it is an external layers), but it is useful to run Unix commands or Bash scripts;
		- 
- Run [Sophia Script](https://github.com/farag2/Sophia-Script-for-Windows);
	- The Readme is a bit convoluted; You can download the Windows 11 + Powershell 7 version;
	- Check the "How To Use Section" (not the wrapper one)
	- After running the elevation command, run the script on terminal `./Sophia.ps1`
	- Make sure your terminal is running PowerShell 7. You can select it on the Windows Terminal new tab;
- Install WSL
	- `wsl --install`
	- This also installs Ubuntu 20.
	- In case you want another distro, browse it on the Store;
	- If you install a different distro, make sure to cleanup the default Ubuntu 20
		- `wsl --unregister Ubuntu` (deletes the distribution)
		- `wsl --list`
		- `wsl -s Ubuntu-22` (set the new default distribution)
	- Make sure you don't have the Docker distribution set as default, as that can cause issues;
	- To access the default distro you can either:
		- Invoke `bash` on any Windows console (right-click Start Icon -> Terminal);
		- Open a new tab on Windows Terminal with the desired distro;
		- Search the distro name on the Start Menu
	- Install apps on WSL. Ex: nodejs, git etc.
	- While Windows already has Linux folders on the Explorer, I also like to install a file manager like Thunar (it is quite a big download, because it installs a lot of other things along). A Linux file manager is quite handy to navigate WSL folders;
- Add SSH keys to both Windows and WSL
	- On Windows, put the SSH key on `<user>/.ssh`; Name the default key `id_rsa`.
	- Check [this article](https://snowdrift.tech/cli/ssh/git/tutorials/2019/01/31/using-ssh-agent-git-windows.html) on setting up a SSH key on the Windows environment. You don't need to follow the last session ("link to git") anymore;
	- Same as usual on Linux
		- `~/.ssh` folder
		- on Linux we also need `chmod 600 <file>`
- Ativate Windows if that's the case;
- UI Tweaks
	- Set displays to 144Hz if they are at 60Hz
	- Set dark mode
	- Add extra buttons to start menu lower bar
		- Settings > Personalization > Start > Folders
	- Search "PrintScreen" on Settings, then set to open Screen Capture when pressing this key;
	- At Recycle Bin properties, reduce Recycle Bin size on all drives. Disable delete confirmation dialog;
	- (optional) You can disable the new context menus with WinAeroTweaker;
	- (optional) You can fix the lackluster W11 Taskbar with StartAllBack
- Install Docker (desktop). Use WSL2 engine.
- Drivers
	- Download drivers from OEM website, if notebook;
	- Download NVIDIA ou AMD driver;
	- Get Intel update tool (optional). Uninstall after running it.

- System apps
	- OEM apps (ex: laptop power control)
	- (optional) Quick CPU: for laptops - finer control on CPU power for quiet laptop. Keep it off as it uses CPU :/
	- (optional) Libre Hardware Monitor: Logs CPU and GPU temp on a chart
	- Equalizer APO (optional)
	- Powertoys (optional). After installing it you should disable most useless teaks.

- Fonts
	- Install your coding fonts. On my case, JetBrains mono.

- Games
	- Steam
		- Setup back the Library folder
	- Things from the games you play

- Entertainment
	- Spotify
	- Stremio
	- OBS
		- Set up twitch

- Install productivity apps
	- Notion
	- VS Code
	- Company proxy if applicable
	- MS Office
	- Screen2Gif
	- DBeaver
	- Paint.net - basic image editing

## Appendix: My Windows Install, and its issues

- On Windows install, select the option for custom partitions;
- Format and select the current Windows drive
- My main drive had a bit messed up partitions due to previous Linux installs;
	- First install failed with error;
	- Next install complained about my partitions;
	- I ended up:
		- Boot into repair mode from the Windows install to open the terminal (SHIFT+F10 probably also works);
		- ` diskpart`
		  `list disk`
		  `select disk <number>`
		  `clean`
		  `convert gpt` (MBR won't work on UEFI boots)
		  - Back on Windows install, create the partition on the partition UI, allocating full space;
		  - The install says that it will automatically create an extra system partition. OK.

The rest of the install proceeded OK. Say no to all Microsofts bullshit.

**Curious notice**
I've also recently installed Windows on a new notebook from a friend. His Windows install was a bit different and didn't prompt for a Microsoft account, it also didn't install bloatware (Netflix/etc). I wonder if it skips the bloat if you enter an activation key.