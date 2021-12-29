const button = document.getElementById("change-screen");

// When the button is clicked, inject setPageBackgroundColor into current page
button.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      const playerContainer = document.getElementById("yohoho");
      const yohohoIframe = document.getElementById("yohoho-iframe");
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
      resizePlayer();
      window.addEventListener("resize", () => {
        requestAnimationFrame(resizePlayer);
        isListenerAdded = true;
      });
    },
  });
});
