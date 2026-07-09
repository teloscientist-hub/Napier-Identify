import http from "node:http";

const port = Number.parseInt(process.env.PORT ?? "8797", 10);
const host = process.env.HOST ?? "127.0.0.1";

const candidates = [
  {
    candidate_id: "candidate_0001",
    item_id: "napier_brooch_0001",
    variant_id: null,
    rank: 1,
    confidence_band: "strong_match",
    visual_score: 0.91,
    metadata_score: 0.76,
    combined_score: 0.87,
    title: "Gold-tone textured brooch",
    item_type: "brooch",
    date_label: "mid-1960s",
    collection_name: "",
    design_family: "textured modernist",
    reference_image_uri: "mock://reference/napier_brooch_0001_ref_01.jpg",
    evidence: ["Strong shape match", "Matches brooch type", "Finish appears compatible"],
  },
  {
    candidate_id: "candidate_0002",
    item_id: "napier_brooch_0002",
    variant_id: "napier_brooch_0002_var_01",
    rank: 2,
    confidence_band: "variant_match",
    visual_score: 0.84,
    metadata_score: 0.69,
    combined_score: 0.79,
    title: "Textured brooch, alternate finish",
    item_type: "brooch",
    date_label: "1960s",
    collection_name: "",
    design_family: "textured modernist",
    reference_image_uri: "mock://reference/napier_brooch_0002_ref_01.jpg",
    evidence: ["Similar silhouette", "Different finish may indicate variant", "Date range is compatible"],
  },
  {
    candidate_id: "candidate_0003",
    item_id: "napier_brooch_0003",
    variant_id: null,
    rank: 3,
    confidence_band: "similar_design",
    visual_score: 0.72,
    metadata_score: 0.48,
    combined_score: 0.64,
    title: "Similar modernist brooch",
    item_type: "brooch",
    date_label: "late-1960s",
    collection_name: "",
    design_family: "modernist",
    reference_image_uri: "mock://reference/napier_brooch_0003_ref_01.jpg",
    evidence: ["Related motif", "Different construction details", "Should not be treated as exact"],
  },
];

const itemDetail = {
  item_id: "napier_brooch_0001",
  canonical_title: "Gold-tone textured brooch",
  item_type: "brooch",
  date_label: "mid-1960s",
  date_start: 1964,
  date_end: 1966,
  collection_name: "",
  design_family: "textured modernist",
  description: "Mock API reference description for testing item detail mapping.",
  reference_images: [
    {
      image_id: "img_brooch_0001_ref_01",
      uri: "mock://reference/napier_brooch_0001_ref_01.jpg",
      caption: "Reference image placeholder",
    },
  ],
  materials: ["gold tone"],
  measurements: ["measurement not yet entered"],
  variants: [
    {
      variant_id: "napier_brooch_0001_var_01",
      title: "Alternate finish",
      note: "Shown as a mock API variant for UI testing.",
    },
  ],
  related_pieces: [
    {
      item_id: "napier_earrings_0001",
      title: "Related earrings",
      item_type: "earrings",
      relationship: "related_set_piece",
      date_label: "mid-1960s",
      image_uri: "mock://reference/related_earrings_0001.jpg",
    },
  ],
  source_citation: {
    source_type: "book",
    title: "The Napier Co.: Defining 20th Century American Costume Jewelry",
    page: "mock page",
    caption: "Mock API caption for layout testing.",
    confidence: "contextual",
  },
  reference_notes: ["Mock API note: authoritative Napier facts should remain separate from user notes."],
};

const server = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `${host}:${port}`}`);

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { status: "ok", service: "napier-mock-api" });
    return;
  }

  if (request.method === "POST" && url.pathname === "/identify") {
    await drainRequest(request);
    const noMatch = url.searchParams.get("mode") === "no_match";
    const serverError = url.searchParams.get("mode") === "server_error";

    if (serverError) {
      sendJson(response, 500, { message: "Mock API identify server error" });
      return;
    }

    sendJson(response, 200, {
      query_id: `api_query_${Date.now()}`,
      status: "completed",
      confidence_band: noMatch ? "no_confident_match" : "strong_match",
      candidates: noMatch ? [] : candidates,
      retry_guidance: noMatch
        ? ["Crop closer to the jewelry", "Add a reverse-side or mark photo", "Choose the jewelry type if known"]
        : [],
      timing_ms: 184,
    });
    return;
  }

  if (request.method === "GET" && url.pathname.startsWith("/items/")) {
    const itemId = decodeURIComponent(url.pathname.replace("/items/", ""));
    if (url.searchParams.get("mode") === "partial") {
      sendJson(response, 200, {
        item_id: itemId || itemDetail.item_id,
        canonical_title: "Partial API detail",
        item_type: "brooch",
        date_label: "date unknown",
      });
      return;
    }

    if (url.searchParams.get("mode") === "server_error") {
      sendJson(response, 500, { message: "Mock API item detail server error" });
      return;
    }

    sendJson(response, 200, { ...itemDetail, item_id: itemId || itemDetail.item_id });
    return;
  }

  sendJson(response, 404, { message: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Napier mock API listening at http://${host}:${port}`);
});

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  if (statusCode === 204) {
    response.end();
    return;
  }
  response.end(JSON.stringify(payload));
}

function drainRequest(request) {
  return new Promise((resolve, reject) => {
    request.on("data", () => undefined);
    request.on("end", resolve);
    request.on("error", reject);
  });
}
