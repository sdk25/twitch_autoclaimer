function counterKey(tabId) {
  return "badgeCount_" + tabId
}

function getCounter(tabId, valueHandler) {
  chrome.storage.local.get(counterKey(tabId), items => {
    valueHandler(items[counterKey(tabId)] || 0)
  })
}

function setCounter(tabId, newValue, callback) {
  chrome.storage.local.set({[counterKey(tabId)]: newValue}, () => {
    const newValueString = newValue.toString()
    chrome.action.setBadgeText({tabId: tabId, text: newValueString})
    chrome.action.setTitle({tabId: tabId, title: "Claimed " + newValueString + " time(s)"})
  }) 
}

function setEnabledState(tabId) {
  chrome.action.setBadgeBackgroundColor({tabId: tabId, color: "#09AB3F"})
  chrome.action.setBadgeText({tabId: tabId, text: "▶"})
  chrome.action.setTitle({tabId: tabId, title: "Click to inject an autoclaimer"})
}

function setDisabledState(tabId) {
  chrome.action.setBadgeBackgroundColor({tabId: tabId, color: "#940000"})
  chrome.action.setBadgeText({tabId: tabId, text: "🞫"})
  chrome.action.setTitle({tabId: tabId, title: "Go to any stream to enable"})
}

function setWorkingState(tabId) {
  chrome.action.setBadgeBackgroundColor({tabId: tabId, color: "#4688F1"})
  chrome.action.setBadgeText({tabId: tabId, text: "0"})
  chrome.action.setTitle({tabId: tabId, title: "Autoclaimer is working.."})
}

function clickEventHandler(tab) {
  setWorkingState(tab.id)

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["content.js"]
  })

  chrome.action.onClicked.removeListener(clickEventHandler)
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    if (/twitch.tv\/.+/i.test(changeInfo.url)) {
      setEnabledState(tabId)
      chrome.action.onClicked.addListener(clickEventHandler)
    } else {
      setDisabledState(tabId)
      chrome.action.onClicked.removeListener(clickEventHandler)
    }
  }
})

chrome.runtime.onMessage.addListener((request, sender) => {
  const tabId = sender.tab.id
  getCounter(tabId, value => setCounter(tabId, value + 1))
})