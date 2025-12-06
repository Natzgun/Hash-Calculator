<script lang="ts">
  import { md4 } from "$lib/crypto/md4";
  import { md5 } from "$lib/crypto/md5";
  import { sha1 } from "$lib/crypto/sha1";
  import { sha256 } from "$lib/crypto/sha256";
  import { hmac, hmac_md4, hmac_md5, hmac_sha1, hmac_sha256 } from "$lib/crypto/hmac";

  let input = "";
  let algorithm = "MD5";
  let output = "";
  let copied = false;
  let hmacKey = ""; // Nueva variable para la clave HMAC
  let hmacMode = false; // Control para mostrar/ocultar campo HMAC

  $: {
    if (hmacMode && hmacKey) {
      // Modo HMAC activado
      if (algorithm === "MD4") {
        output = hmac_md4(hmacKey, input, md4, 64);
      } else if (algorithm === "MD5") {
        output = hmac_md5(hmacKey, input, md5, 64);
      } else if (algorithm === "SHA1") {
        output = hmac_sha1(hmacKey, input, sha1, 64);
      } else if (algorithm === "SHA256") {
        output = hmac_sha256(hmacKey, input, sha256, 64);
      } else if (algorithm === "Base64") {
        output = "HMAC not available for Base64";
      }
    } else {
      // Modo hash normal
      if (algorithm === "MD4") {
        output = md4(input);
      } else if (algorithm === "MD5") {
        output = md5(input);
      } else if (algorithm === "SHA1") {
        output = sha1(input);
      } else if (algorithm === "SHA256") {
        output = sha256(input);
      } else if (algorithm === "Base64") {
        try {
          output = btoa(input);
        } catch (e) {
          output = "Invalid input for Base64";
        }
      }
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }

  function clearAll() {
    input = "";
    hmacKey = "";
    output = "";
  }
</script>

<div class="container">
  <header>
    <h1>Hash Calculator</h1>
    <p>Let me cook :v</p>
  </header>

  <div class="card">
    <div class="input-group">
      <label for="input">Message</label>
      <textarea
        id="input"
        bind:value={input}
        placeholder="Type your secret message here..."
      ></textarea>
    </div>

    <!-- Control HMAC -->
    <div class="hmac-control">
      <label class="hmac-switch">
        <input type="checkbox" bind:checked={hmacMode} />
        <span class="hmac-slider">Use HMAC</span>
      </label>
    </div>

    <!-- Campo para clave HMAC (solo visible cuando hmacMode = true) -->
    {#if hmacMode}
      <div class="input-group hmac-key-group">
        <label for="hmacKey">HMAC Secret Key</label>
        <input
          type="text"
          id="hmacKey"
          bind:value={hmacKey}
          placeholder="Enter your secret key..."
        />
      </div>
    {/if}

    <div class="controls">
      <label for="algorithm">Algorithm</label>
      <select id="algorithm" bind:value={algorithm}>
        <option value="MD4">MD4</option>
        <option value="MD5">MD5</option>
        <option value="SHA1">SHA-1</option>
        <option value="SHA256">SHA-256</option>
        <option value="Base64">Base64</option>
      </select>
    </div>

    <div class="output-group">
      <div class="output-header">
        <label for="output">Output</label>
        <div class="output-actions">
          <button class="clear-btn" on:click={clearAll}>Clear All</button>
          <button
            class="copy-btn"
            on:click={copyToClipboard}
            aria-label="Copy to clipboard"
            disabled={!output}
          >
            {#if copied}
              Copied!
            {:else}
              Copy
            {/if}
          </button>
        </div>
      </div>
      <div class="output-wrapper">
        <textarea 
          id="output" 
          readonly 
          value={output}
          placeholder="Hash will appear here..."
        ></textarea>
      </div>
    </div>

    <!-- Información HMAC -->
    {#if hmacMode}
      <div class="info-box">
        <strong>ℹ️ HMAC Mode Active</strong>
        <p>HMAC (Hash-based Message Authentication Code) combines your message with a secret key for authentication.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  header {
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 300;
    margin: 0;
    letter-spacing: -1px;
  }

  p {
    color: #888;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .card {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    text-align: left;
  }

  label {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  textarea,
  select,
  input[type="text"] {
    width: 100%;
    background: #222;
    border: 1px solid #333;
    color: #ddd;
    padding: 1rem;
    border-radius: 6px;
    font-family: "Courier New", Courier, monospace;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  textarea:focus,
  select:focus,
  input[type="text"]:focus {
    border-color: #555;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  input[type="text"] {
    min-height: auto;
  }

  .input-group,
  .controls,
  .output-group {
    margin-bottom: 1.5rem;
  }

  .hmac-control {
    margin: 1.5rem 0;
    padding: 1rem;
    background: rgba(0, 100, 255, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(0, 100, 255, 0.2);
  }

  .hmac-switch {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .hmac-switch input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .hmac-slider {
    font-weight: bold;
    color: #4dabf7;
  }

  .hmac-key-group {
    background: rgba(0, 100, 255, 0.05);
    padding: 1rem;
    border-radius: 6px;
    border: 1px dashed rgba(0, 100, 255, 0.3);
  }

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .output-actions {
    display: flex;
    gap: 10px;
  }

  .output-wrapper {
    position: relative;
  }

  #output {
    background: #000;
    color: #fff;
    border: 1px solid #333;
    min-height: 120px;
  }

  .copy-btn, .clear-btn {
    background: #333;
    color: #fff;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s;
  }

  .copy-btn:hover:not(:disabled) {
    background: #4CAF50;
  }

  .clear-btn:hover {
    background: #f44336;
  }

  .copy-btn:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .info-box {
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(255, 193, 7, 0.1);
    border-left: 4px solid #ffc107;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #ffc107;
  }

  .info-box strong {
    color: #ffc107;
  }

  .info-box p {
    color: #ffc107;
    opacity: 0.8;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    text-transform: none;
    letter-spacing: normal;
  }

  .test-examples {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #1a1a1a;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .test-examples h3 {
    color: #888;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .example-buttons, .hmac-examples {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .test-examples button {
    background: #333;
    color: #ddd;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .test-examples button:hover {
    background: #444;
    transform: translateY(-2px);
  }

  .hmac-examples button {
    background: rgba(0, 100, 255, 0.2);
    color: #4dabf7;
  }

  .hmac-examples button:hover {
    background: rgba(0, 100, 255, 0.3);
  }
</style>