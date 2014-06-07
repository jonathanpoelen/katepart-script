<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/1999/xhtml">
<!-- 	xmlns:fo="http://www.w3.org/1999/XSL/Format" -->

<xsl:output
	method="xml"
	indent="yes"
	encoding="UTF-8"
	omit-xml-declaration="no"
	doctype-system="about:legacy-compat"/>


<xsl:template name="text-description">
	<xsl:param name="text"/>
	<xsl:for-each select="$text">
		<xsl:choose>
			<xsl:when test="name(.)">
				<a class="ref-function" href="#function-{.}"><xsl:value-of select="."/></a>
			</xsl:when>
			<xsl:otherwise>
					<xsl:value-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="param-definition">
	<xsl:param name="param"/>
	<xsl:if test="$param/@name">
		<span class="var-name"><xsl:value-of select="$param/@name"/></span>
	</xsl:if>
	<xsl:if test="$param/@type">
		: <span class="var-type"><xsl:value-of select="$param/@type"/></span>
	</xsl:if>
	<xsl:if test="$param/@default">
		= <span class="var-default"><xsl:value-of select="$param/@default"/></span>
	</xsl:if>
</xsl:template>

<xsl:template match="param">
	<xsl:param name="extended" select="'no'"/>
	<xsl:choose>
		<xsl:when test="@name = '[param]'">
			<span class="var-param"><span class="var-param-begin">[</span><span class="var-name">params</span> : <span class="var-type">mixed</span>, <span class="var-name">…</span><span class="var-param-end">]</span></span>
		</xsl:when>
		<xsl:when test="@ref-function">
			<xsl:variable name="function-name" select="@ref-function"/>
			<xsl:variable name="params" select="../../../function[@name=$function-name]/params"/>
			<xsl:choose>
				<xsl:when test="@name">
					<xsl:variable name="var-name" select="@name"/>
					<xsl:variable name="param" select="$params/param[@name=$var-name]"/>
					<xsl:apply-templates select="$param">
						<xsl:with-param name="extended" select="$extended"/>
					</xsl:apply-templates>
				</xsl:when>
				<xsl:when test="$extended = 'yes'">
					<xsl:apply-templates select="$params"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="$params" mode="inline"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:when>
		<xsl:when test="$extended = 'yes'">
			<dt>
				<xsl:call-template name="param-definition">
					<xsl:with-param name="param" select="."/>
				</xsl:call-template>
			</dt>
			<xsl:if test="text()">
				<dd>
					<xsl:call-template name="text-description">
						<xsl:with-param name="text" select="node()"/>
					</xsl:call-template>
				</dd>
			</xsl:if>
		</xsl:when>
		<xsl:otherwise>
			<xsl:call-template name="param-definition">
				<xsl:with-param name="param" select="."/>
			</xsl:call-template>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="param" mode="extended">
	<xsl:apply-templates select=".">
		<xsl:with-param name="extended" select="'yes'"/>
	</xsl:apply-templates>
</xsl:template>


<xsl:template match="params">
	<xsl:if test="@ref-function">
		<xsl:variable name="name" select="@ref-function"/>
		<xsl:apply-templates select="../../function[@name=$name]/params"/>
	</xsl:if>
	<xsl:apply-templates select="param" mode="extended"/>
</xsl:template>

<xsl:template match="params" mode="inline">
	<xsl:if test="@ref-function">
		<xsl:variable name="name" select="@ref-function"/>
		<xsl:apply-templates select="../../function[@name=$name]/params" mode="inline"/>
		<xsl:if test="param">, </xsl:if>
	</xsl:if>

	<xsl:for-each select="param">
		<xsl:apply-templates select="."/>
		<xsl:if test="position() != last()">, </xsl:if>
	</xsl:for-each>
</xsl:template>


<xsl:template match="examples">
	<xsl:for-each select="example">
		<div class="example">
			<xsl:if test="resume">
				<pre class="resume"><xsl:value-of select="resume"/></pre>
			</xsl:if>
			<pre class="command"><code><xsl:value-of select="code"/></code></pre>
			<pre class="result"><xsl:value-of select="result"/></pre>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template match="function/resume">
	<xsl:if test="@ref-function">
		<xsl:variable name="name" select="@ref-function"/>
		<xsl:apply-templates select="../../function[@name=$name]/resume"/>
	</xsl:if>
	<xsl:call-template name="text-description">
		<xsl:with-param name="text" select="node()"/>
	</xsl:call-template>
</xsl:template>


<xsl:template match="return">
	<xsl:choose>
		<xsl:when test="@ref-function">
			<xsl:variable name="name" select="@ref-function"/>
			<xsl:apply-templates select="../../function[@name=$name]/return"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="."/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>


<xsl:template match="function">
	<article class="function" id="function-{@name}">
		<h1><xsl:value-of select="@name"/></h1>
		<p class="resume"><xsl:apply-templates select="resume"/></p>
		<xsl:if test="@action-key">
			<p class="action-key">Cette commande est disponible par le racourci: <span><xsl:value-of select="@action-key"/></span></p>
		</xsl:if>
		<p class="back-menu"><a href="#menu-function-{@name}">←</a><a href="#top">↑</a></p>
		<xsl:if test="params">
			<div class="params">
				<dl>
					<xsl:apply-templates select="params"/>
				</dl>
			</div>
		</xsl:if>
		<xsl:if test="examples">
			<div class="examples">
				<xsl:apply-templates select="examples"/>
			</div>
		</xsl:if>
		<xsl:if test="return">
			<div class="return">
				<p><xsl:apply-templates select="return"/></p>
			</div>
		</xsl:if>
		<xsl:if test="params or examples or return">
			<p class="back-menu"><a href="#menu-function-{@name}">←</a><a href="#top">↑</a></p>
		</xsl:if>
	</article>
</xsl:template>

<xsl:template match="/root">
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr">
		<head>
			<meta charset="utf-8"/>
			<title>Doc-script: pwaipwai.utils.js</title>
			<meta name="description" content="documentation pour pwaiwpai.utils.js, un ensemble de script pour KatePart"/>
<!--			<link rel="Shortcut Icon" type="image/ico" href="img/favicon.png"/>
			<link rel="stylesheet" href="css/reset.css" type="text/css" media="screen"/>
			<link rel="stylesheet" href="css/style.css" type="text/css" media="screen"/>
			<link rel="stylesheet" href="css/queries/netbooks-tablets.css" type="text/css" media="screen and (max-width: 1007px)" />

			<script type="text/javascript" src="js/html5.js"></script>-->
			<link rel="stylesheet" href="css/style.css" type="text/css" media="screen"/>
		</head>
		<body role="document" id="top">
			<header>
				<h1>Commandes pour <span>KatePart</span></h1>
				<dl>
					<dt>Autheur</dt>
					<dd>Jonathan Poelen</dd>
					<dt>E-mail</dt>
					<dd><a href="mailto:jonathan.poelen@gmail.com">jonathan.poelen@gmail.com</a></dd>
					<dd><a href="mailto:jo.link.noir@gmail.com">jo.link.noir@gmail.com</a></dd>
				</dl>
				<nav>
					<ul>
						<xsl:for-each select="./*">
							<li><a href="#function-type-{@type}"><xsl:value-of select="@type"/> (<xsl:value-of select="count(function)"/>)</a></li>
						</xsl:for-each>
					</ul>
				</nav>
			</header>
			<xsl:for-each select="./*">
				<section role="main" id="function-type-{@type}">
					<header>
						<h1>Function type : <xsl:value-of select="@type"/></h1>
					</header>
					<nav>
						<ul>
							<xsl:for-each select="function">
								<!--TODO faire par ordre naturel -->
								<xsl:sort select="@name" order="ascending"/>
								<li id="menu-function-{@name}"><a href="#function-{@name}"><span class="function-name"><xsl:value-of select="@name"/></span><span>(<xsl:apply-templates select="params" mode="inline"/>)</span></a></li>
							</xsl:for-each>
						</ul>
					</nav>
					<section class="functions">
						<xsl:for-each select="function">
							<xsl:sort select="@name" order="ascending"/>
							<xsl:apply-templates select="."/>
						</xsl:for-each>
					</section>
				</section>
			</xsl:for-each>
			<footer>
				<div class="inside">
				</div>
			</footer>
		</body>
	</html>
</xsl:template>


</xsl:stylesheet>
