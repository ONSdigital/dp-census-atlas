<script type="text/javascript" lang="ts">
  export let href: string, title: string, id: string;
</script>

<div class="ons-card" {id} aria-labelledBy="{id}-title" aria-describedBy="text">
  <h3 class="ons-u-fs-m" id="{id}-title">
    <a {href}>{title}</a>
  </h3>
  <p id="{id}-card"><slot /></p>
</div>
