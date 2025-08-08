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

router.get("/Compra", (req, res) => { 
    res.render("./pages/indexCompra");
});
router.get("/SobreNosotros", (req, res) => { 
    res.render("./pages/indexAboutUs");
});


 export default router;