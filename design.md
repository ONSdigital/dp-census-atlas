# Design

Interpretation:

- this is a thorough redesign, plus significant additional vision / future roadmap
  - (there is far more potential dev work here than we've been considering so far)
- redesign aims:
  - support multiple viz modes (but release simple univariate first)
  - much more compact
  - far less (almost no?) extraneous information about "areas"

Immediate response:

- `mode: Single Indicator` as the first thing you see / main thing is super scary. Just this will scare off most of our potential users. So, move to a separate "Choose" screen, with more space for explanation and context, BUT you don't see it first time - first time users go to the simple (univariate) mode. `[icon, eg globe-alt or sparkles, switch-horizontal, view-list] One indicator - Change`
- love the thumbnail previews of the modes / map types
- what is the big percentage? what does it _mean_?
  - 51.9% of people in Newport 0140 identify as English / Welsh / Scottish / Northern Irish / British
  - 51.9% of households in the UK have Gas Central Heating
  - `[value] of [units] in [area] [verb-phrase] [value]` - perhaps all we need is a `verb` property on the `variable`. That's it for custom content. (Check Welsh tho).
    - have
    - are
    - identifies as
    - ...
- An _optional_ explanation eg Unpaid care - _People who provide unpaid care._ still very very useful for the "introductory" variables.
- More examples
  - Highest level of qualification gained
    - 32% of people in the UK have No qualifications
  - Size of household
    - 32% of households are a 1 person household

Questions:

- explain change vs 2001 (`-3.55p`? Percentage points?)

Challenges:

- we have to have some user-centered design for this to be useful
  - strike a "lean" balance
- how to add classifications?

Suggestions:

- name: Census Maps
  - simpler that "Census Data Apps" (sounds complicated)
  - "Census Atlas" is misleading
  - we have Google Maps, Apple Maps, so this construction is very understood
- user testing
  - "hallway usability testing" - test on family
