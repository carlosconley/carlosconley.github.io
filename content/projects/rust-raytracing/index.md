---
title: Monte Carlo Raytracing in Rust 

tags:
 - graphics
 - raytracing
 - rust

categories:
 - project


cover: cover.png
date: 2024-01-19 

description: My rust implementation of Peter Shirley's [Raytracing in One Weekend Series](https://raytracing.github.io/), fit with additional geometry types, auto-exposure, and parallel processing. Repo [here](https://github.com/carlosconley/surely-raytracing/)

---

## Images from the project

### Final render of the first book
{{< image src="./cover.png" alt="Render of randomly generated spheres with depth of field and multiple material types" position="center">}}

Complete with glass, metal, and lambert materials, as well as depth of field and field of view parameters!

### Custom suns and variable exposure
{{< image src="./sun.png" alt="Render of 3 spheres with a single light source and dim background" position="center">}}

I added sun-like light sources and auto-exposure to deal with the variable image quality when not biasing samples.

