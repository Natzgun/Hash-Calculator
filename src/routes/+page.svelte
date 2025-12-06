<script lang="ts">
  import { md4 } from "$lib/crypto/md4";
  import { md5 } from "$lib/crypto/md5";
  import { sha1 } from "$lib/crypto/sha1";
  import { sha512 } from "$lib/crypto/sha512";
  import { sha3_512 } from "$lib/crypto/sha3_512";
  import { ripemd160 } from "$lib/crypto/ripemd160";

  let input = "";
  let algorithm = "MD5";
  let output = "";
  let copied = false;

  $: {
    if (algorithm === "MD4") {
      output = md4(input);
    } else if (algorithm === "MD5") {
      output = md5(input);
    } else if (algorithm === "SHA1") {
      output = sha1(input);
    } else if (algorithm === "SHA512") {
      output = sha512(input);
    } else if (algorithm === "SHA3-512") {
      output = sha3_512(input);
    } else if (algorithm === "RIPEMD160") {
      output = ripemd160(input);
    } else if (algorithm === "Base64") {
      try {
        output = btoa(input);
      } catch (e) {
        output = "Invalid input for Base64";
      }
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
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

    <div class="controls">
      <label for="algorithm">Algorithm</label>
      <select id="algorithm" bind:value={algorithm}>
        <option value="MD4">MD4</option>
        <option value="MD5">MD5</option>
        <option value="SHA1">SHA-1</option>
        <option value="SHA512">SHA2-512</option>
        <option value="SHA3-512">SHA3-512</option>
        <option value="RIPEMD160">RIPEMD-160</option>
        <option value="Base64">Base64</option>
      </select>
    </div>

    <div class="output-group">
      <label for="output">Output</label>
      <div class="output-wrapper">
        <textarea id="output" readonly value={output}></textarea>
        <button
          class="copy-btn"
          on:click={copyToClipboard}
          aria-label="Copy to clipboard"
        >
          {#if copied}
            Copied!
          {:else}
            Copy
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: 600px;
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
  select {
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
  select:focus {
    border-color: #555;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .input-group,
  .controls,
  .output-group {
    margin-bottom: 1.5rem;
  }

  .output-wrapper {
    position: relative;
  }

  #output {
    background: #000;
    color: #fff;
    border: 1px solid #333;
  }

  .copy-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #333;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s;
  }

  .copy-btn:hover {
    background: #555;
  }
</style>
