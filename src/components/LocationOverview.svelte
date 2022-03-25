<script lang="ts">
  export let allPeopleTotal: string, allHouseholdsTotal: string;
</script>

<div class="ons-grid explore-container">
  <div class="ons-grid__col ons-col-6@m">
    <div class="ons-pl-grid-col">
      <h3 class="ons-u-fs-s explore-sub-title">All people (usual residents)</h3>
      <p class="ons-u-fs-l explore-data">{allPeopleTotal}</p>
    </div>
  </div>
  <div class="ons-grid__col ons-col-6@m">
    <div class="ons-pl-grid-col">
      <h3 class="ons-u-fs-s explore-sub-title">All households</h3>
      <p class="ons-u-fs-l explore-data">{allHouseholdsTotal}</p>
    </div>
  </div>
</div>
