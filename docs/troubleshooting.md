# pondok-ai — Troubleshooting Guide

Common issues and resolutions when running `pondok-ai`.

---

## 1. Environment Diagnostic (`doctor`)

Before manual troubleshooting, always run the built-in diagnostic tool:

```bash
pondok-ai doctor
```

This verifies:
- Docker daemon status and version
- Docker Compose v2 availability
- Total and available RAM (warns if < 8GB)
- Disk space availability (warns if < 10GB)
- Hardware acceleration (Metal / CUDA)
- Port availability (checks for conflicts on 3000, 8000, 11434, etc.)

---

## 2. Common Scenarios

### Docker daemon is not running
**Error**: `Cannot connect to the Docker daemon at unix:///var/run/docker.sock`
**Solution**:
- **macOS / Windows**: Start Docker Desktop from Applications.
- **Linux**: Start the service via `sudo systemctl start docker`.

---

### Port Conflict (e.g. Port 3000 or 11434 already in use)
**Error**: `Bind for 127.0.0.1:11434 failed: port is already allocated`
**Solution**:
1. Check what is using the port:
   ```bash
   lsof -i :11434  # macOS / Linux
   netstat -ano | findstr 11434  # Windows
   ```
2. If another native Ollama instance is running, you can stop it:
   ```bash
   killall ollama  # or brew services stop ollama
   ```
3. Or edit the port mapping in `pondok-ai.json`:
   ```json
   "services": {
     "ollama": {
       "port": 11435
     }
   }
   ```
   Then run `pondok-ai up`.

---

### Out of Memory (OOM) / Model Pull Fails
**Symptom**: Model download aborts or container restarts during inference.
**Solution**:
- Ensure you have selected a model that fits your hardware. Recommended model tiers:
  - **4GB–8GB RAM**: `llama3.2:1b`, `tinyllama`, `phi3:mini`
  - **8GB–16GB RAM**: `llama3.2:3b`, `mistral:7b`
  - **16GB–32GB RAM**: `llama3.1:8b`, `codellama:7b`
  - **32GB+ RAM**: `llama3.1:70b` (quantized)

---

### "does not support tools" in Open WebUI
**Symptom**: Chatting with a model such as `gemma3:4b` in Open WebUI fails with `... does not support tools`.
**Cause**: Open WebUI 0.11 defaults to native function calling and sends its built-in tools with every chat. Ollama rejects tools for models whose template has no tool support.
**Solution**:
- Stacks created with pondok-ai 0.5.1 or later start Open WebUI with legacy function calling, which works with every model.
- Stacks created earlier keep the setting stored in Open WebUI's database, so change it once as the admin: **Admin Panel > Settings > Models > Model Defaults > Configure > Model Parameters > Configure**, click **Function Calling** until it shows **Legacy**, then **Save**. To fix a single model instead, open it from the same **Models** list and set **Function Calling** under **Advanced Params**.

---

### Open WebUI refuses connections right after `pondok-ai up`
**Symptom**: `http://localhost:3000` shows `ERR_CONNECTION_REFUSED` or `ERR_EMPTY_RESPONSE` for a few minutes after the first `pondok-ai up`.
**Cause**: On first start Open WebUI downloads its support models before it accepts connections. This can take several minutes on a slow connection.
**Solution**:
- `pondok-ai up` waits up to 5 minutes for it and says "still starting" if it is not ready by then. Wait longer with `pondok-ai up --timeout 600`.
- Follow its progress with `pondok-ai status` and `pondok-ai logs openwebui --follow`. The page loads once the logs show the server listening on port 8080.

---

### Native Ollama is not reachable (macOS)
**Symptom**: `pondok-ai up` warns `Native Ollama is not reachable on port 11434 and could not be started automatically.`
**Cause**: `up` tries to open the Ollama app and then `ollama serve`, and neither answered on the port within 30 seconds.
**Solution**:
- Check that Ollama is installed: `ollama --version`. If not, run `brew install ollama` or download it from https://ollama.com/download.
- Start it yourself with `ollama serve` or by opening the Ollama app, then run `pondok-ai up` again.
- If `up` started it with `ollama serve`, its output is in `.pondok-ai/ollama.log`.

---

### Checking Container Logs
To inspect live logs from any service:
```bash
# View logs from all services
pondok-ai logs

# View logs from a specific service (e.g., ollama, openwebui, api)
pondok-ai logs ollama

# Follow logs in real time
pondok-ai logs -f api
```

---

### Clean Reset
If your Docker state or containers become corrupted:
```bash
# Remove containers and networks (preserves data volumes)
pondok-ai down

# Complete reset with prompt to remove data volumes
pondok-ai reset
```
