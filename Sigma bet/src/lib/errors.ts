export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

function isDatabaseUnreachable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("Connection refused") ||
    msg.includes("ECONNREFUSED") ||
    error.name === "PrismaClientInitializationError"
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (isDatabaseUnreachable(error)) {
    console.error("[DB]", error);
    return Response.json(
      {
        error:
          "Banco de dados indisponível. Inicie o PostgreSQL (ex.: npm run db:up) e confira DATABASE_URL no .env",
        code: "DATABASE_UNAVAILABLE",
      },
      { status: 503 }
    );
  }

  console.error(error);
  return Response.json(
    { error: "Erro interno do servidor" },
    { status: 500 }
  );
}
