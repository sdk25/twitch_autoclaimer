function dispatchObserver(tabId) { return () => {
  const observer = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (typeof addedNode.querySelector === "function") {
          const button = addedNode.querySelector("button[aria-label='Claim Bonus']")
          if (button) {
            button.click()
            chrome.storage.local.get("badgeCount_" + tabId, items => {
              const newBadgeCount = (items.badgeCount || 0) + 1
              chrome.storage.local.set({["badgeCount_" + tabId]: newBadgeCount}, () => {
                const newBadgeCountString = newBadgeCount.toString()
                chrome.action.setBadgeText({tabId: tabId, text: newBadgeCountString})
                chrome.action.setTitle({tabId: tabId, title: "Claimed " + newBadgeCountString + " time(s)"})
              })
            })
          }
        }
      }
    }
  })

  const container = document.querySelector(".community-points-summary")
  observer.observe(container, {childList: true, subtree: true})
}}

function clickEventHandler(tab) {
  chrome.action.setBadgeBackgroundColor({tabId: tab.id, color: "#4688F1"})
  chrome.action.setBadgeText({tabId: tab.id, text: "0"})
  chrome.action.setTitle({tabId: tab.id, title: "Autoclaimer is working.."})

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: dispatchObserver(tab.id)
  })

  chrome.action.onClicked.removeListener(clickEventHandler)
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    if (/twitch.tv\/.+/i.test(changeInfo.url)) {
      chrome.action.setBadgeBackgroundColor({tabId: tabId, color: "#09AB3F"})
      chrome.action.setBadgeText({tabId: tabId, text: "▶"})
      chrome.action.setTitle({tabId: tabId, title: "Click to inject an autoclaimer"})

      chrome.action.onClicked.addListener(clickEventHandler)
    } else {
      chrome.action.setBadgeBackgroundColor({tabId: tabId, color: "#940000"})
      chrome.action.setBadgeText({tabId: tabId, text: "🞫"})
      chrome.action.setTitle({tabId: tabId, title: "Go to any stream to enable"})

      chrome.action.onClicked.removeListener(clickEventHandler)
    }
  }
})