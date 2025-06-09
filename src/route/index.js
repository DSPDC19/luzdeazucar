import { Router } from "express";

const router = Router();

router.get("/", (req, res) => { 
    res.render("./pages/indexHome");
});

router.get("/Menu", (req, res) => { 
    res.render("./pages/indexMenu");
});


 export default router;