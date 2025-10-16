window.addEventListener('DOMContentLoaded', async () => {
  const vintiButton = document.getElementById('vinti-button');
  const vintiButtonTab = document.getElementById('vinti-button-tab');
  const instonomoButton = document.getElementById('instonomo-button');
  const chatbotButton = document.getElementById('chatbot-button');

  // Use environment variable for per-user AppData path
  const possiblePaths = [
    "C:\\Program Files\\Vinti\\Vinti.exe",                      // all users, 64-bit
    "C:\\Program Files (x86)\\PlingifyPlug\\Vinti\\Vinti.exe", // all users, 32-bit
    "%LOCALAPPDATA%\\Programs\\Vinti\\Vinti",                  // per-user folder
    "%LOCALAPPDATA%\\Programs\\Vinti\\Vinti.exe"               // per-user exe
  ];

  let foundPath = null;

  for (let p of possiblePaths) {
    // Replace %LOCALAPPDATA% with actual value on this PC
    if (p.includes("%LOCALAPPDATA%")) {
      p = p.replace("%LOCALAPPDATA%", window.electronAPI.getLocalAppData());
    }

    const exists = await window.electronAPI.checkPath(p);
    if (exists) {
      foundPath = p;
      break;
    }
  }

  if (foundPath) {
    vintiButton.textContent = 'Open Vinti';
    vintiButton.onclick = () => window.electronAPI.openPath(foundPath);
  } else {
    vintiButton.textContent = 'Download Vinti';
    vintiButton.onclick = () =>
      window.electronAPI.openPath('Vinti_Setup_2.4.000.10A.exe');
  }

    if (foundPath) {
    vintiButtonTab.textContent = 'Open Vinti';
    vintiButtonTab.onclick = () => window.electronAPI.openPath(foundPath);
  } else {
    vintiButtonTab.textContent = 'Download Vinti';
    vintiButtonTab.onclick = () =>
      window.electronAPI.openPath('Vinti_Setup_2.4.000.10A.exe');
  }

  instonomoButton.onclick = () => window.electronAPI.openWebsite('https://backuppass.github.io/InstonomoAI');
  chatbotButton.onclick = () => window.electronAPI.openWebsite('https://backuppass.github.io/Instonomo/');
});
