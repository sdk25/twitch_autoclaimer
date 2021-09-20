console.log("button_observer.js deployed")

function findButton(node) {
  return typeof node.querySelector === "function"
    ? node.querySelector("button[aria-label='Claim Bonus']")
    : null
}

function clickButton(button) {
  button.click()
  chrome.runtime.sendMessage({inc: true})
}

function findButtonAndClick(node) {
  const button = findButton(node)
  if (button) clickButton(button)
}

const buttonObserver = new MutationObserver((mutations, observer) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      findButtonAndClick(addedNode)
    }
  }
})

findButtonAndClick(document)

const container = document.querySelector(".community-points-summary")
buttonObserver.observe(container, {childList: true, subtree: true})