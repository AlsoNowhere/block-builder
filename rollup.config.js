
export default {
    input: "./src/main.js",
    output: {
        file: "./dist/app.js",
        name: "app",
        format: "iife",
        sourcemap: true
    },
    watch: {
        exclude: "node_modules/**"
    }
}
