package sod.tymep

import scala.io.Source
import java.net.URL
import javax.xml.stream.XMLInputFactory
import java.io.FileInputStream
import javax.xml.stream.XMLStreamReader
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.xpath.XPathFactory
import javax.xml.xpath.XPathConstants
import scala.xml._

object ImportMEPs extends App {

  val url = "http://www.europarl.europa.eu/meps/en/xml.html?query=full"
  val meps_file = "meps.xml"

  def mep_json(el: Node) = s"""
  {
    "id": ${(el \ "id").text},
  	"fullName": "${(el \ "fullName").text}",
  	"country": "${(el \ "country").text}",
  	"politicalGroup": "${(el \ "politicalGroup").text}",
  	"nationalPoliticalGroup": "${(el \ "nationalPoliticalGroup").text}"
  }"""

  val xml = XML.loadFile(meps_file) \ "mep"

  var i = 0
  xml.toStream.foreach {
    x =>
      i += 1
      println(s"MEP $i")
      println(mep_json(x))
  }

}
