import httpx

async_client: httpx.AsyncClient | None = None

async_client = httpx.AsyncClient(
    timeout =5,
    headers = {"Accept": "application/json"},
)
