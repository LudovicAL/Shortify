const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const INCIPIT_INDEX_URL = "https://raw.githubusercontent.com/LudovicAL/Shortify/refs/heads/main/incipitIndex.json";

const TUNE_DATA_LIST_DIV = document.getElementById("tuneDatalistDiv");
const ABC_DIV = document.getElementById("abcDiv");
const RENDERING_DIV = document.getElementById("renderingDiv");
const WARNINGS_DIV = document.getElementById("warningsDiv");
const SETS_DIV = document.getElementById("setsDiv");
const PRINT_DIV = document.getElementById("printDiv");
const SWITCH_RENDER_SET_NAMES = document.getElementById("switchRenderSetNames");
const SWITCH_RENDER_TUNE_NAMES = document.getElementById("switchRenderTuneNames");
const SWITCH_BORDER_SETS = document.getElementById("switchBorderSets");
const SWITCH_BORDER_TUNES = document.getElementById("switchBorderTunes");