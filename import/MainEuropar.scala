package sod.tymep

// TODO: commit maven config

import org.jsoup.Jsoup
import org.jsoup.nodes.Element
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import java.text.SimpleDateFormat
import java.util.Locale
import scala.concurrent.Future
import scala.concurrent.ExecutionContext
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import java.io.FileOutputStream

object MainEuropar extends App {

  val fos = new FileOutputStream("MEPS.json", true)

  implicit val ec = ExecutionContext.global

  val euparl_url = "http://www.europarl.europa.eu/meps/en/full-list.html?filter=all&leg="

  val doc = Crawler.grab_url(euparl_url).get

  var i = 0
  val meps_list = doc.select("div.zone_info_mep").toStream
  meps_list
    .par
    .map {

      e =>

        try {

          i += 1

          println(s"\nMEP $i\n")

          val mep_url = e.select("a[href]").attr("abs:href")
          val mep_img = e.select("img[src]").attr("abs:src")
          val mep_name = e.select(".mep_details .mep_name").text().trim()
          // TODO: tokenizzare

          val mep_id = mep_url.replaceAll("http://www.europarl.europa.eu/meps/en/(\\d+)/(.*).html", "$1")

          val group = e.select(".mep_details .group").text().trim()
          val nationality = e.select(".mep_details .nationality").text().trim()

          // retrieving data from MEP url

          val mep = Await.ready(Future {
            Crawler.grab_url(mep_url).get
          }, Duration.apply(2, "minute")).value.get.get

          val details = mep.select(".zone_info_mep_transparent_mep_details")

          val party = mep.select(".nationality span.name_pol_group").text()

          val date_info = details.select(".more_info").last()

          val mep_fullname = details.select(".mep_name a").html().split("<br>").toList

          val first_name = mep_fullname(0)
          val last_name = mep_fullname(1).split("\\s+").map {
            w => w.head.toUpper + w.tail.toLowerCase()
          }.mkString(" ")

          val BIRTH = """Date of birth: (.*?), (.*?)""".r
          val BIRTH(birth_txt, birth_place) = date_info.text().trim()
          val birth_date = new SimpleDateFormat("dd MMMM yyyyy", Locale.ENGLISH).parse(birth_txt)

          val rss = mep.select(".widget.socials .rss a[href]").attr("abs:href")
          val box_links = mep.select(".widget.socials ~ .boxcontent.in_boxflux").first()
          val email = box_links.select("a[href].link_email").attr("abs:href").trim()
          val website = box_links.select("a[href].link_website").attr("abs:href").trim()
          val facebook = box_links.select("a[href].link_fb").attr("abs:href").trim()
          val twitter = box_links.select("a[href].link_twitt").attr("abs:href").trim()
          val youtube = box_links.select("a[href].link_youtube").attr("abs:href").trim()

          val mep_json = s"""
          {
            "id": "${mep_id}",
            "name": "${mep_name}",
            "first_name": "${first_name}",
            "last_name": "${last_name}",
            "url": "${mep_url}",
            "img": "${mep_img}",
            "group": "${group}",
            "nationality": "${nationality}",
            "party": "${party}",
            "birth_date": "${birth_date}",
            "birth_place": "${birth_place}",
            "email": "${email}",
            "website": "${website}",
            "facebook": "${facebook}",
            "twitter": "${twitter}",
            "youtube": "${youtube}",
            "rss": "${rss}"            
          }
          """

          fos.write(mep_json.getBytes)

        } catch {

          case ex: Exception => System.err.println("ERROR: ", ex, e)

        }

    }

}

object Crawler {

  def grab_url(url: String) = {
    Jsoup.connect(url)
      .followRedirects(true)
      .userAgent("SOD")
      .header("Cache-control", "public")
  }

}



