function initState() {
  chrome.action.setBadgeBackgroundColor({color: '#4688F1'})
  chrome.storage.local.set({'badgeCount': 0})
}

function increaseBadge(tab) {
  chrome.storage.local.get('badgeCount', items => {
    const newValue = items.badgeCount + 1
    increaseBadgeHandler(newValue, tab.id)
    chrome.storage.local.set({'badgeCount': newValue})
  })
}

function increaseBadgeHandler(newValue, tabId) {
  const newValueString = newValue.toString()
  chrome.action.setBadgeText({tabId: tabId, text: newValueString})
  chrome.action.setTitle({tabId: tabId, title: 'Claimed ' + newValueString +  ' time(s)'})
}

chrome.runtime.onInstalled.addListener(initState)
chrome.action.onClicked.addListener(increaseBadge)