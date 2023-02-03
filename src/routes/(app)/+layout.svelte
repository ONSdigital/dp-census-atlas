<script>
  import App from "../../components/App.svelte";
  import Layout from "../../components/Layout.svelte";

  export let data;
</script>

<App contentForStore={data.contentForStore}>
  <Layout><slot /></Layout>
</App>
