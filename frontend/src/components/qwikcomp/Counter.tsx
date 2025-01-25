/** @jsxImportSource @builder.io/qwik */
import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import headSupport from '../../../public/scripts-lib/htmxhead.js';
import setRipple from '../../../public/scripts-lib/ripple.js';
import htmx from 'htmx.org';

export const Counter = component$(() => {
  const counter = useSignal(0);
  useVisibleTask$(() => {
    headSupport(htmx);
    setRipple();
    console.log('testobombo');
  });

  const trying = $(() => {
    console.log(counter.value);
  });
  const increment = $(() => {
    counter.value++;
  });

  return (
    <>
      <button id="counter-button" onClick$={[increment, trying]}>
        Decrisment Counter
      </button>
      <span id="counter">{counter.value}</span>
      <div id="hello">{counter.value}</div>
      <button
        type="button"
        data-ripple-light="true"
        class="select-none rounded-lg bg-gray-900 px-6 py-3 text-center align-middle font-sans text-xs font-bold
          uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20
          focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none
          disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick$={(ev) => {
          const target = ev.target as HTMLElement;
          let pTarget = htmx.find('p');
          counter.value--;
          if (pTarget) {
            const pTrarget = pTarget as HTMLElement;
            pTrarget.innerText = counter.value.toString();
          }
        }}
      >
        Increment Counter
      </button>
      <button
        data-ripple-light="true"
        hx-get="/partilals/testobombo"
        hx-trigger="click delay:1s"
        hx-swap="outerHTML"
        class="select-none rounded-lg bg-gray-900 px-6 py-3 text-center align-middle font-sans text-xs font-bold
          uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20
          focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none
          disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Hello
      </button>
    </>
  );
});
