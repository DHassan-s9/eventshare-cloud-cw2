// =============================
// EventShare Cloud REST v1 APIs
// =============================
const RAAURI =
  "https://prod-61.uksouth.logic.azure.com/workflows/140826b30e2b4d1a803607d53597dbb6/triggers/When_an_HTTP_request_is_received/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=dzSUReYB4VFdl66yGbKb0mH7b28sSK6tV26BtLESN80";

const CIAURI =
  "https://prod-59.uksouth.logic.azure.com/workflows/e6c4d505543a4384bde8341ff6aaf1d2/triggers/When_an_HTTP_request_is_received/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=hBdVR7VYYDw-DoRR7RW2gquedx_TCuQ_Ll3X6mmvVuA";

const DIAURI0 =
  "https://prod-34.uksouth.logic.azure.com/workflows/fa7ef15d7c3c4dcd99059e03edb93845/triggers/When_an_HTTP_request_is_received/paths/invoke/rest/v1/assets/";
const DIAURI1 =
  "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=aovbX-NtoDFOqRhrBMnYF11YTaZMAufv4lcKrFPD0-c";

// =======================
// Handlers
// =======================
$(document).ready(function () {
  $("#retAssets").click(loadAssets);
  $("#subNewForm").click(createAsset);
  $("#clearAssets").click(() => $("#AssetList").html(""));
  $("#resetForm").click(() => $("#newAssetForm")[0].reset());
});

// =======================
// CREATE (CIA - POST)
// =======================
function createAsset() {
  const payload = {
    eventId: $("#EventID").val(),
    assetName: $("#AssetName").val(),
    mediaType: $("#MediaType").val(),
    blobUrl: $("#BlobUrl").val(),
    uploadedBy: $("#UploadedBy").val(),
    caption: $("#Caption").val(),
  };

  $.ajax({
    url: CIAURI,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function () {
      loadAssets();
    },
    error: function (xhr) {
      alert("Create failed: " + xhr.responseText);
    },
  });
}

// =======================
// READ ALL (RAA - GET)
// =======================
function loadAssets() {
  const filterEventId = ($("#FilterEventID").val() || "").trim().toLowerCase();
  $("#AssetList").html('<div class="spinner-border"></div>');

  $.getJSON(RAAURI, function (data) {
    let html = "";
    data.forEach((a) => {
      if (filterEventId && a.EventID.toLowerCase() !== filterEventId) return;

      html += `
      <div class="border p-2 mb-2 rounded">
        <strong>${a.AssetName}</strong><br/>
        <small>Event: ${a.EventID} • By ${a.UploadedBy}</small><br/>
        <small>${a.Caption || ""}</small><br/>
        <a href="${a.BlobUrl}" target="_blank">Open Image</a><br/>
        <button class="btn btn-sm btn-danger mt-1" onclick="deleteAsset(${a.AssetID})">Delete</button>
      </div>`;
    });

    $("#AssetList").html(html || "<p>No assets found.</p>");
  });
}

// =======================
// DELETE (DIA - DELETE)
// =======================
function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;

  $.ajax({
    type: "DELETE",
    url: DIAURI0 + id + DIAURI1,
    success: function () {
      loadAssets();
    },
    error: function (xhr) {
      alert("Delete failed: " + xhr.responseText);
    },
  });
}
