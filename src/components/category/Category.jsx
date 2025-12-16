import { Link, useParams } from "react-router-dom";

export default function Category() {

    const param = useParams();
    const imageURL = import.meta.env.VITE_APP_IMAGE_BASE_URL;


    return (
        <>

            <h1 className="text-center text-3xl mt-12">Category</h1>
            <h2 className="text-center text-uppercase text-xl mb-12">{param.slug}</h2>





            {/* ---------------------Explore More category ------------------------- */}

            <div className="my-15 relative md:px-16 px-4">
                <h2 className="text-center mb-8 text-2xl font-semibold">
                    Explore More Categories
                </h2>

                <div className="varieties">
                    <div className="flex gap-2">


                        <div className="w-1/5">
                            <Link to={`/category/pressure-cooker`}>
                                <div className="m-1 rounded-xl overflow-hidden">
                                    <img src={imageURL + "assets/category/pressure-cooker.png"} />
                                </div>
                                <p className="text-center font-bold  py-1 mt-1">Pressure Cooker</p>
                            </Link>
                        </div>

                        <div className="w-1/5">
                            <Link to={`/category/cookware`}>
                                <div className="m-1 rounded-xl overflow-hidden">
                                    <img src={imageURL + "assets/category/cookware.png"} />
                                </div>
                                <p className="text-center font-bold  py-1 mt-1">Cookware</p>
                            </Link>
                        </div>

                        <div className="w-1/5">
                            <Link to={`/category/gas-stove`}>
                                <div className="m-1 rounded-xl overflow-hidden">
                                    <img src={imageURL + "assets/category/gas-stove.png"} />
                                </div>
                                <p className="text-center font-bold  py-1 mt-1">Gas Stove</p>
                            </Link>
                        </div>

                        <div className="w-1/5">
                            <Link to={`/category/mixer-grinder`}>
                                <div className="m-1 rounded-xl overflow-hidden">
                                    <img src={imageURL + "assets/category/mixer-grinder.png"} />
                                </div>
                                <p className="text-center font-bold  py-1 mt-1">Mixer Grinder</p>
                            </Link>
                        </div>

                        <div className="w-1/5">
                            <Link to={`/category/gas-tandoor`}>
                                <div className="m-1 rounded-xl overflow-hidden">
                                    <img src={imageURL + "assets/category/gas-tandoor.png"} />
                                </div>
                                <p className="text-center font-bold  py-1 mt-1">Gas Tandoor</p>
                            </Link>
                        </div>


                    </div>
                </div>





            </div>

        </>
    );

};
