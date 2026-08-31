const verifyTurnstileToken = async (
  token,
  remoteIp = null
) => {
  if (
    !process.env.TURNSTILE_SECRET_KEY
  ) {
    throw new Error(
      "TURNSTILE_SECRET_KEY belum dikonfigurasi."
    );
  }

  if (!token) {
    return {
      success: false,
      errorCodes: [
        "missing-input-response",
      ],
    };
  }

  const body =
    new URLSearchParams();

  body.append(
    "secret",
    process.env.TURNSTILE_SECRET_KEY
  );

  body.append(
    "response",
    token
  );

  if (remoteIp) {
    body.append(
      "remoteip",
      remoteIp
    );
  }

  const response =
    await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
      }
    );

  if (!response.ok) {
    throw new Error(
      "Gagal menghubungi layanan Cloudflare Turnstile."
    );
  }

  return response.json();
};

const turnstileMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.body?.turnstile_token ||
      req.body?.[
        "cf-turnstile-response"
      ];

    const remoteIp =
      req.ip ||
      req.headers[
        "x-forwarded-for"
      ] ||
      req.socket?.remoteAddress ||
      null;

    const result =
      await verifyTurnstileToken(
        token,
        remoteIp
      );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          "Verifikasi keamanan gagal. Silakan selesaikan CAPTCHA terlebih dahulu.",
        errorCodes:
          result["error-codes"] || [],
      });
    }

    req.turnstile =
      result;

    next();
  } catch (error) {
    console.error(
      "Turnstile verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Verifikasi keamanan sedang mengalami gangguan.",
    });
  }
};

module.exports = {
  turnstileMiddleware,
  verifyTurnstileToken,
};