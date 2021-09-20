const observer = new MutationObserver((mutations, observer) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (typeof addedNode.querySelector === "function") {
        const button = addedNode.querySelector("button[aria-label='Claim Bonus']")
        if (button) {
          button.click()
          console.log("claimed!")
          chrome.runtime.sendMessage({})
        }
      }
    }
  }
})

const container = document.querySelector(".community-points-summary")
observer.observe(container, {childList: true, subtree: true})