<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-57286064-7"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-57286064-7');
  </script>

  <script type="text/javascript" src="js/jquery-1.12.0.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <script type="text/javascript" src="js/bootstrap-slider.min.js"></script>
  <script type="text/javascript" src="js/three.min.js"></script>
  <script type="text/javascript" src="js/threex.domevents.js"></script>
  <script type="text/javascript" src="js/TrackballControls.js"></script>
  <script type="text/javascript" src="js/3d.js"></script>
  <link href="css/bootstrap.min.css" type="text/css" rel="stylesheet"></link>
  <link href="css/bootstrap-slider.min.css" type="text/css" rel="stylesheet"></link>
  <link href="css/font-awesome.min.css" type="text/css" rel="stylesheet"></link>
  <link href="css/styles.css" type="text/css" rel="stylesheet"></link>

  <!-- <style type="text/css" media="screen">
  	body {
	  	margin-top: 51px;
  	}
  </style>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	
	  ga('create', 'UA-57286064-4', 'auto');
	  ga('send', 'pageview');
	
	</script> -->
</head>
<body>

<!-- Fixed navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
  <div id="nav" class="container">
    <div class="navbar-header">
<!--
      <button id="nav-icon" type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
-->
      <a class="navbar-brand" href="http://engervall.com/"><i class="fa fa-home" aria-hidden="true"></i></a>
    </div>
  </div>
</div>

<main>
  <canvas id="scene"></canvas>
  <div class="row settings">
    <div class="col-xs-4">
      <div class="menu-button" id="reset" onclick=reset()>
          <i class="fa fa-repeat" aria-hidden="true"></i>
          Reset Camera
        </span>
      </div>
      <div class="menu-button" onclick=toggleSpin()>
        <i class="fa fa-refresh" aria-hidden="true"></i>
        Toggle spin
      </div>
    </div>
    <div class="col-xs-4">
      <div class="row">
        <div class="col-xs-4">
          <p>Time of day</p>
        </div>
        <div class="col-xs-4">
          <p id="timeOfDay"></p>
        </div>
      </div>

       <input id="ex1"
       data-slider-id='ex1Slider'
       type="text"
       class="span2"
       value=""
       data-slider-min="0"
       data-slider-max="63"
       data-slider-step="1"
       data-slider-value="[0,4]"/>
    </div>
    <div class="col-xs-4" style="display: none">
      <p>Clicked room</p>
      <p id="chosenRoom">None</p>
    </div>
  </div> <!-- row -->
</main>

</body>
</html>
