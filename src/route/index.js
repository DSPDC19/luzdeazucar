import { Router } from "express";

const router = Router();

router.get("/", (req, res) => { 
    res.render("./pages/index");
});

router.get("/Menu", (req, res) => { 
    res.render("./pages/indexMenu");
});

router.get("/Contactanos", (req, res) => { 
    res.render("./pages/indexContactanos");
});


 export default router;