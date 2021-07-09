<template>
  <svg
    width="35"
    height="35"
    viewBox="0 0 50 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_dd)">
      <path
        d="M9 21C9 12.1634 16.1634 5 25 5C33.8366 5 41 12.1634 41 21C41 29.8366 33.8366 37 25 37C16.1634 37 9 29.8366 9 21Z"
        fill="white"
      />
      <path
        d="M19 21H31"
        stroke="#1F1F33"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25 15L25 27"
        stroke="#1F1F33"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25 36C16.7157 36 10 29.2843 10 21H8C8 30.3888 15.6112 38 25 38V36ZM40 21C40 29.2843 33.2843 36 25 36V38C34.3888 38 42 30.3888 42 21H40ZM25 6C33.2843 6 40 12.7157 40 21H42C42 11.6112 34.3888 4 25 4V6ZM25 4C15.6112 4 8 11.6112 8 21H10C10 12.7157 16.7157 6 25 6V4Z"
        fill="#EEEDF7"
      />
    </g>
    <defs>
      <filter
        id="filter0_dd"
        x="0"
        y="0"
        width="50"
        height="50"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          radius="1"
          operator="erode"
          in="SourceAlpha"
          result="effect1_dropShadow"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.101961 0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.101961 0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: "addSvg",
};
</script>

<style>
</style>