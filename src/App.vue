<template>
  <div id="app">
    <h1>K.K. Speech Parser</h1>
    <p>
      Write down whatever you want (ex. song lyrics) in the input box below, and click "Parse". 
      Each word will get broken down into its CMU phonetic components,
      and associated with the closest K.K. Slider sound.
    </p>
    <p>Please note that this system isn't perfect, and may fail with uncommon words!</p>
    <p>K.K. Slider has about 5 distinct singing sounds:</p>
    <ul>
      <li>"Nah"</li>
      <li>"Me"</li>
      <li>"Now"</li>
      <li>"Way"</li>
      <li>"Oh"</li>
    </ul>
    <p>The sounds chosen by this tool are approximates, and may need to be finely tuned yourself.</p>
    <h2>Input</h2>
    <textarea v-model="input" rows="15" />
    <button class='button full' @click.prevent="parse">Parse</button>
    <h2>Output</h2>
    <div class='output-container'>{{output}}</div>
    <div class='error-container' v-if="errors.length > 0">
      <span>Unknown words: {{ errors.join(', ') }}</span><br>
      <span>You may need to adjust your input.</span>
    </div>
  </div>
</template>

<script>
import Parser from '../parser';

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      input: '',
      output: '',
      errors: []
    }
  },
  methods: {
    parse() {
      const parser = new Parser();

      parser.parse(this.input);

      this.output = parser.output();
      this.errors = [...parser.errors];
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  font-family: sans-serif;
}

#app {
  max-width: 900px;
  margin: 0 auto;
}

.button {

}
.button.full {
  width: 100%;
}

textarea {
  width: 100%;
}

.output-container {
  background: rgba(0, 0, 0, 0.05);
  padding: 5px;
  font-family: monospace;
  white-space: pre;
  overflow-x: auto;
  margin-bottom: 20px;
}
</style>