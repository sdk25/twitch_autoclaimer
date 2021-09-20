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

function clickEventHandler(tab) {
  setCounter(tab.id, 0)

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["content/button_observer.js"]
  })

  chrome.action.onClicked.removeListener(clickEventHandler)
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({color: "#4688F1"})
})

chrome.runtime.onMessage.addListener((request, sender) => {
  const tabId = sender.tab.id

  if (typeof request.ready !== 'undefined') {
    if (request.ready) {
      chrome.action.setBadgeText({tabId: tabId, text: "RUN"})
      chrome.action.onClicked.addListener(clickEventHandler)
    } else {
      chrome.action.setBadgeText({tabId: tabId, text: ""})
      chrome.action.onClicked.removeListener(clickEventHandler)
    }
  }

  if (typeof request.inc !== 'undefined') {
    getCounter(tabId, value => setCounter(tabId, value + 1))
  }
})