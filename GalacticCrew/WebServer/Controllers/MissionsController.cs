using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GalacticCrew.WebServer.Models;
using GalacticCrew.WebServer.Services.MySQL;
using Microsoft.AspNetCore.Authorization;

namespace GalacticCrew.WebServer.Controllers
{
    public class MissionsController : Controller
    {
        // GET: MissionsController
        public ActionResult Index()
        {
            Missions mission = new Missions();
            mission.MissionDesc = "random stuff";
            mission.MissionDistance = 3000;
            mission.MissionReward = 2000;
            mission.MissionTitle = "Mission impossible";
            return View("Webserver/views/Missions/Missionpanel.cshtml", mission);
        }

        public List<Missions> AllMissions()
        {
            QuerySQL query = new QuerySQL();
            return query.GetMissionTable();
        }

        // GET: MissionsController/Details/5
        public ActionResult Details(int id)
        {
            
            return View();
        }

        // GET: MissionsController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: MissionsController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: MissionsController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: MissionsController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: MissionsController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: MissionsController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
