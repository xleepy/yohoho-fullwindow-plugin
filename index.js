const button = document.getElementById("change-screen");

const toggleButtonClassname = (isEnabled) => {
  if (isEnabled) {
    button.classList.add("btn--enabled");
  } else {
    button.classList.remove("btn--enabled");
  }
};

// view init
chrome.storage.sync.get("isEnabled", ({ isEnabled }) =>
  toggleButtonClassname(isEnabled)
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === "isEnabled") {
      toggleButtonClassname(newValue);
    }
  }
});

const toggleState = (isEnabled) => {
  const newState = !isEnabled;
  button.setAttribute("data-enabled", newState ? "true" : "false");
  chrome.storage.sync.set({ isEnabled: newState });
};

const isEnabled = () => {
  return button.getAttribute("data-enabled") == "true";
};

// When the button is clicked, inject setPageBackgroundColor into current page
button.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  toggleState(isEnabled());

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      const previousWidth = 650;
      const previousHeight = 370;

      const playerContainer = document.getElementById("yohoho");
      const yohohoIframe = document.getElementById("yohoho-iframe");

      if (!playerContainer || !yohohoIframe) {
        alert("Please select video first");
        return;
      }

      const resizePlayer = () => {
        playerContainer.style.top = 0;
        playerContainer.style.position = "fixed";
        playerContainer.style.bottom = "42px";
        playerContainer.style.left = 0;
        playerContainer.style.right = 0;
        playerContainer.style.width = "100%";
        playerContainer.style.height = "auto";
        yohohoIframe.style.width = "100%";
        yohohoIframe.style.height = "100%";
        yohohoIframe.width = "100%";
        yohohoIframe.height = "100%";
      };
      const handleWindowResize = () => {
        requestAnimationFrame(resizePlayer);
      };

      chrome.storage.sync.get("isEnabled", ({ isEnabled }) => {
        if (isEnabled) {
          resizePlayer();
          window.addEventListener("resize", handleWindowResize);
        } else {
          console.log("removed");
          window.removeEventListener("resize", handleWindowResize);
          playerContainer.style.position = "relative";
          playerContainer.style.width = `${previousWidth}px`;
          playerContainer.style.height = `${previousHeight}px`;
          yohohoIframe.style.width = `${previousWidth}px`;
          yohohoIframe.style.height = `${previousHeight}px`;
          yohohoIframe.width = `${previousWidth}px`;
          yohohoIframe.height = `${previousHeight}px`;
        }
      });
    },
  });
});
