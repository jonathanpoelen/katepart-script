<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet
	version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:ks="http://jonathan.poelen/katepart-script/text2js"
	>

<xsl:output
	method="text"
	indent="yes"
	encoding="UTF-8"/>

<xsl:function name="ks:jstring-quote" as="xs:string">
	<xsl:param name="s" as="xs:string"/>
	<xsl:sequence select="replace(replace($s, '\\', '\\\\'), '&quot;', '\\&quot;')"/>
</xsl:function>

<xsl:function name="ks:text2jstring" as="xs:string">
	<xsl:param name="s" as="xs:string"/>
	<xsl:sequence select="replace(ks:jstring-quote($s), '\n', '&lt;br/>&quot;+&#xa;		&quot;')"/>
</xsl:function>

<xsl:variable name="doc" select="document(/root)/root"/>

<xsl:template name="param-definition">
	<xsl:param name="param"/>
	<xsl:if test="$param/@name"><xsl:value-of select="$param/@name"/></xsl:if>
	<xsl:if test="$param/@type">: <xsl:value-of select="$param/@type"/></xsl:if>
	<xsl:if test="$param/@default">= <xsl:value-of select="ks:jstring-quote($param/@default)"/></xsl:if>
</xsl:template>

<xsl:template match="param">
	<xsl:choose>
		<xsl:when test="@name = '[param]'">"[params: mixed, …]"+</xsl:when>
		<xsl:when test="@ref-function">
			<xsl:variable name="function-name" select="@ref-function"/>
			<xsl:variable name="params" select="../../../function[@name=$function-name]/params"/>
			<xsl:choose>
				<xsl:when test="@name">
					<xsl:variable name="var-name" select="@name"/>
					<xsl:variable name="param" select="$params/param[@name=$var-name]"/>
					<xsl:apply-templates select="$param"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="$params"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:when>
		<xsl:otherwise>
			"<xsl:call-template name="param-definition">
				<xsl:with-param name="param" select="."/>
			</xsl:call-template>"+
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="params">
	<xsl:if test="@ref-function">
		<xsl:variable name="name" select="@ref-function"/>
		<xsl:apply-templates select="../../function[@name=$name]/params"/>
		<xsl:if test="param">", "+</xsl:if>
	</xsl:if>
	<xsl:for-each select="param">
		<xsl:apply-templates select="."/><xsl:if test="position() != last()">", "+</xsl:if>
	</xsl:for-each>
</xsl:template>

<xsl:template name="param-description">
	<xsl:param name="param"/>
	<xsl:value-of select="$param/@name"/>: <xsl:value-of select="ks:jstring-quote(normalize-space($param))"/>
</xsl:template>

<xsl:template name="params-description">
	<xsl:param name="params"/>
	<xsl:if test="$params/@ref-function">
		<xsl:variable name="name" select="$params/@ref-function"/>
		<xsl:call-template name="params-description">
			<xsl:with-param name="params" select="../../function[@name=$name]/params"/>
		</xsl:call-template>
	</xsl:if>
	<xsl:for-each select="$params/param">
		<xsl:if test="text()">
			"&lt;br/><xsl:call-template name="param-description">
				<xsl:with-param name="param" select="."/>
			</xsl:call-template>"+
		</xsl:if>
	</xsl:for-each>
</xsl:template>

<xsl:template match="examples">
	<xsl:for-each select="example">
		"&lt;br/>&lt;br/>exemple:"+
		<xsl:if test="resume">"&lt;br/><xsl:value-of select="ks:text2jstring(resume)"/>"+</xsl:if>
		"&lt;br/>$ <xsl:value-of select="ks:jstring-quote(normalize-space(code))"/>"+
		"&lt;br/><xsl:value-of select="ks:text2jstring(result)"/>"+
	</xsl:for-each>
</xsl:template>

<xsl:template match="function">
	if (cmd === "<xsl:value-of select="@name"/>")
		return i18n("<xsl:value-of select="ks:text2jstring(normalize-space(resume))"/>"+

		"&lt;br/>&lt;br/><xsl:value-of select="@name"/>("+<xsl:if test="params">
			<xsl:apply-templates select="params"/>
		</xsl:if>")"+
		<xsl:if test="params">
			<xsl:call-template name="params-description">
				<xsl:with-param name="params" select="params"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="examples">
			<xsl:apply-templates select="examples"/>
		</xsl:if>);
</xsl:template>

<xsl:template match="/root">
function help(cmd)
{<xsl:for-each select="$doc/functions[@type='function']/function">
	<xsl:sort select="@name" order="ascending"/>
	<xsl:apply-templates select="."/>
</xsl:for-each>}
</xsl:template>


</xsl:stylesheet>
