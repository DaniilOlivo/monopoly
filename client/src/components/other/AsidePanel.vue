<template>
    <div class="aside-panel">
        <SelectInput 
                v-model="$i18n.locale"
                :arrValues="languageArray"
                :arrLabels="languageArrayLabels"></SelectInput>

        <h6 class="label-version">v1.2.0</h6>
            
        <a href="https://github.com/DaniilOlivo/monopoly" class="github">
            <img :src="icoGithub" alt="GitHub" class="github__image">
            <img :src="icoGithubHover" alt="github_image_hover" class="github__image_hover">
            GitHub
        </a>
    </div>
</template>

<script>
import icoGithub from './img/icoGithub.png'
import icoGithubHover from './img/icoGithubHover.png'
import SelectInput from '../common/SelectInput.vue';

export default {
    name: "AsidePanel",
    components: {
        SelectInput,
    },
    data() {
        return {
            icoGithub,
            icoGithubHover,
            languageArray: ["en", "ru"],
        }
    },
    computed: {
        languageArrayLabels() {
            return this.languageArray.map(lang => lang.toUpperCase())
        }
    }
}
</script>

<style scoped>
.aside-panel {
    position: fixed;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 30px 50px;
}

.label-version {
    color: gray;
    font-size: 18px;
    font-weight: 200;
}

.github {
    display: flex;
    gap: 0.5em;
    align-items: center;

    color: black;
    font-size: 20px;

    transition: 200ms;
}

.github:hover {
    color: brown;
}

.github__image_hover {
    display: none;
}

.github:hover .github__image {
    display: none;
}

.github:hover .github__image_hover {
    display: inline;
}
</style>
