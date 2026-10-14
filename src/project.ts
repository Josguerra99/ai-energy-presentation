import {makeProject} from '@motion-canvas/core';

import './global.css';

import paso0Ia from './scenes/paso0-01-ia?scene';
import paso0ParaleloCostos from './scenes/paso0-02-paralelo-costos?scene';
import paso0Servidor from './scenes/paso0-03-servidor?scene';
import paso0VirtGpu from './scenes/paso0-04-virt-gpu?scene';
import paso0UsoEnergetico from './scenes/paso0-04-uso-energetico?scene';
import paso0CostosLlm from './scenes/paso0-03-costos-llm?scene';
import paso0Agua from './scenes/paso0-03-agua?scene';
import paso0Recomendaciones from './scenes/paso0-05-recomendaciones?scene';

export default makeProject({
  scenes: [
    paso0Ia,
    paso0ParaleloCostos,
    paso0Servidor,
    paso0VirtGpu,
    paso0CostosLlm,
    paso0UsoEnergetico,
    paso0Agua,
    paso0Recomendaciones,
  ],
});
