import React, { useEffect, useState } from "react"
import SbEditable from "storyblok-react"
import {
  render,
  NODE_IMAGE,
  NODE_UL,
  NODE_LI,
} from "storyblok-rich-text-react-renderer"
import { isMobileOnly } from "react-device-detect"
import { navigate } from "gatsby-link"
import SEO from "../components/HeadSeo"
import { convertDateString } from "../utils/date"
import { truncate } from "../utils/string"

const windowGlobal = typeof window !== "undefined" && window

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = windowGlobal
  return {
    width,
    height,
  }
}

let morePosts = []

const BlogPost = ({ blok }) => {
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    windowGlobal.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  setTimeout(function () {
    var href = window.location.href
    const facebook_url = "https://www.facebook.com/sharer/sharer.php?u=" + href
    const linkedin_url =
      "https://www.linkedin.com/shareArticle?mini=true&url=" + href
    const twitter_url = "http://twitter.com/share?url=" + href

    const fb = document.getElementById("facebook")

    if (fb) {
      document.getElementById("facebook").setAttribute("href", facebook_url)
      document.getElementById("linkedin").setAttribute("href", linkedin_url)
      document.getElementById("twitter").setAttribute("href", twitter_url)
    }
  }, 1500)

  morePosts = blok.allPosts
    ? blok.allPosts.filter(post => post.content.featured == false)
    : []

  for (const post of morePosts) {
    if (post.content.created_at == "") {
      post["ordering"] = parseInt(
        post.first_published_at.split("T")[0].replace(/-/g, "")
      )
      console.log(
        parseInt(post.first_published_at.split("T")[0].replace(/-/g, ""))
      )
    } else {
      post["ordering"] = parseInt(
        post.content.created_at.split(" ")[0].replace(/-/g, "")
      )
    }
  }

  morePosts.sort(function (a, b) {
    return a.ordering - b.ordering
  })

  return (
    <SbEditable content={blok} key={blok._uid}>
      <SEO
        description="Volume delivers software tools and user experiences that increase protocol token utility and community engagement, measured by protocol transaction volume growth"
        content={blok}
      />
      <div className="page-container page-blogs">
        <div className="section section-white section-column page-blogs-details">
          <img className="page-blogs-details-img" src={blok.image} />
          <h1 className="page-blogs-details-title">{blok.title}</h1>
          <p className="page-blogs-details-subtitle">{blok.intro}</p>
          <div className="page-blogs-details-intro">
            {render(blok.long_text, {
              nodeResolvers: {
                [NODE_IMAGE]: (children, props) => (
                  <img
                    {...props}
                    style={{ borderRadius: "0px", maxWidth: "100%" }}
                  />
                ),
                [NODE_UL]: (children, props) => (
                  <ul
                    {...props}
                    style={{
                      listStyleType: "square",
                      listStylePosition: "inside",
                      paddingBottom: 16,
                      paddingLeft: 16,
                    }}
                  >
                    {children}
                  </ul>
                ),
                [NODE_LI]: (children, props) => (
                  <li {...props} className="storyblok-bullet-li">
                    {children}
                  </li>
                ),
              },
              blokResolvers: {
                ["YouTube-blogpost"]: props => (
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      className="embed-responsive-item"
                      src={
                        "https://www.youtube.com/embed/" +
                        props.YouTube_id.replace("https://youtu.be/", "")
                      }
                    ></iframe>
                  </div>
                ),
              },
            })}
          </div>

          <div
            className="page-blogs-list"
            style={{ paddingLeft: 0, pddingRight: 0 }}
          >
            <h1>Latest Articles</h1>
            <div className="blog-list">
              {morePosts.reverse().map((post, index) => (
                <div className="blog-list-item" key={`blog-item-${index}`}>
                  <div className="blog-list-item-left">
                    <img src={post.content.image} />
                  </div>
                  <div className="blog-list-item-right">
                    <span className="blog-list-item-date">
                      {convertDateString(post.published_at)}
                    </span>
                    <a
                      onClick={e => {
                        e.preventDefault()
                        navigate(`/${post.full_slug}`)
                      }}
                      className="blog-list-item-title"
                    >
                      {post.content.title}
                    </a>
                    <div className="blog-list-item-divider"></div>
                    <p className="blog-list-item-intro">{truncate(post.content.intro, 161)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SbEditable>
  )
}
export default BlogPost
