import { Volcry } from '../../src/app';
let app = new Volcry({port : 3000, base_scan : "./tests/example"})
app.start()