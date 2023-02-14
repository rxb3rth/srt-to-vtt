const dropArea = document.getElementById("drop-area");
const downloadArea = document.getElementById("download-area");

dropArea.addEventListener("dragover", function (event) {
  event.preventDefault();
});

dropArea.addEventListener("drop", function (event) {
  event.preventDefault();

  const files = event.dataTransfer.files;

  downloadArea.innerHTML = "";

  [...files].forEach(convertToVTT);
});

function convertToVTT(file) {
  const reader = new FileReader();

  reader.onload = function () {
    const srtData = reader.result;

    const vttLines = [];

    vttLines.push("WEBVTT");
    vttLines.push("");

    const srtLines = srtData.split("\n");

    for (let i = 0; i < srtLines.length; i++) {
      const line = srtLines[i].trim();

      if (/^\d+$/.test(line)) {
        vttLines.push("");
      } else if (
        /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/.test(
          line
        )
      ) {
        const start = line.split(" --> ")[0];
        const end = line.split(" --> ")[1];

        vttLines.push(
          `${start.replace(",", ".")} --> ${end.replace(",", ".")}`
        );
      } else {
        vttLines.push(line);
      }
    }

    renderLink(vttLines.join("\n"), file);
  };

  reader.readAsText(file);
}

function renderLink(srtData, file) {
  const blob = new Blob([srtData], { type: "text/vtt" });
  const url = URL.createObjectURL(blob);

  const item = document.createElement("li");

  const downloadLink = document.createElement("a");

  const name = file.name.replace(".srt", ".vtt");

  downloadLink.href = url;
  downloadLink.download = name;
  downloadLink.innerText = name;

  item.appendChild(downloadLink);
  downloadArea.appendChild(item);
}
