export function badRequestFromZod(error) {
  const issue = error?.issues?.[0];
  const field = issue?.path?.[0] || "request";
  const message = issue?.message || "Invalid request";

  return json(
    {
      code: 400,
      message: `The field \`${field}\` is invalid. ${message}`,
    },
    400
  );
}

export function internalServerError() {
  return json(
    {
      code: 500,
      message: "Internal Server Error",
    },
    500
  );
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}
