const express = require("express");
const userDb = require("./posts-model.js");

const router = express.Router();
router.use(express.json());

// 1 [GET] /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await userDb.find();
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

// 2 [GET] /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await userDb.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
    res.status(200).json(post);
  } catch {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

// 3 [POST] /api/posts
router.post("/", async (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;
  if (!title || !contents) {
    return res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  }

  try {
    const post = await userDb.insert({ title, contents });
    const newCreated = await userDb.findById(post.id);
    res.status(201).json(newCreated);
  } catch {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

// 4 [PUT] /api/posts/:id
router.put("/:id", async (req, res) => {
  const title = req.body.title;
  const contents = req.body.contents;

  if (!title || !contents) {
    return res
      .status(400)
      .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
  }

  try {
    const old = await userDb.findById(req.params.id);
    if (!old) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    await userDb.update(req.params.id, { title, contents });
    const updated = await userDb.findById(req.params.id);
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

// 5 [DELETE] /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const post = await userDb.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID li gönderi bulunamadı" });
    }

    await userDb.remove(req.params.id);
    res.status(200).json(post);
  } catch {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

// 6 [GET] /api/posts/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await userDb.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Girilen ID'li gönderi bulunamadı." });
    }

    const comments = await userDb.findPostComments(req.params.id);
    res.status(200).json(comments);
  } catch {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
