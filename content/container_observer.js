console.log("container_observer.js deployed")

function hasContainer(node) {
  return typeof node.querySelector === "function"
  && node.querySelector(".community-points-summary")
}

const containerObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (Array.from(mutation.addedNodes).some(hasContainer)) {
      chrome.runtime.sendMessage({ready: true})
    }

    if (Array.from(mutation.removedNodes).some(hasContainer)) {
      chrome.runtime.sendMessage({ready: false})
    }
  }
})

if (hasContainer(document.body)) {
  chrome.runtime.sendMessage({ready: true})
}

containerObserver.observe(document.body, {childList: true, subtree: true})



